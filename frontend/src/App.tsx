import './App.css'
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import {DashboardPage} from "./pages/DashboardPage.tsx";
import {Layout} from "./components/layout/Layout.tsx";
import {PipelinePage} from "./pages/PipelinePage.tsx";
import {useEffect, useState} from "react";
import type {
    Application,
    ApplicationStatus,
    CreateApplicationRequest,
    StatusChange,
    UpdateApplicationRequest
} from "./types/application.ts";
import {
    createApplicationApi,
    deleteApplicationApi,
    getApplications,
    getStatusHistoryApi,
    updateApplicationApi,
    updateApplicationNotesApi,
    updateApplicationStatusApi
} from "./api/applications.ts";
import {STATUSES} from "./constants/status.ts";
import type {Enrichment} from "./types/enrichment.ts";
import {fetchJobPostingEnrichmentApi} from "./api/enrichment.ts";

export default function App() {
    const [backendApps, setBackendApps] = useState<Application[]>([]);

    const [isLoading, setIsLoading] = useState(false);
    const [cursor, setCursor] = useState("");
    const [limit] = useState(10); // fixed for now
    const [hasMore, setHasMore] = useState(false);

    useEffect(() => {
        loadApps(true);
    }, []);


    useEffect(() => {
        if (import.meta.env.DEV) {
            backendApps.forEach(app => {
                if (!STATUSES.includes(app.status)) {
                    throw new Error(`Invalid status detected: ${app.status}`);
                }
            });
        }

    }, [backendApps]);


    async function loadApps(reset = false) {
        setIsLoading(true);

        const data = await getApplications(limit, cursor);

        setCursor(data.nextCursor)
        setHasMore(data.hasMore)

        setBackendApps(prev =>
            reset ? data.content : [...prev, ...data.content]
        );

        setIsLoading(false);
    }


    async function getStatusHistory(applicationId: number): Promise<StatusChange[]> {
        return await getStatusHistoryApi(applicationId);
    }

    async function createApplication(request: CreateApplicationRequest) {
        await createApplicationApi(request);
        setCursor("");
        await loadApps(true);

    }

    async function deleteApplication(id: number) {
        setBackendApps(prev => prev.filter(app => app.id !== id));

        try {
            await deleteApplicationApi(id);
        } catch (error) {
            await loadApps();
        }
    }

    async function updateApplicationStatus(
        status: ApplicationStatus,
        id: number
    ) {
        const previous = structuredClone(backendApps);

        setBackendApps(prev =>
            prev.map(app =>
                app.id === id ? {...app, status} : app
            )
        );

        try {
            const updated = await updateApplicationStatusApi(id, status);

            setBackendApps(prev =>
                prev.map(app =>
                    app.id === id ? updated : app
                )
            );
        } catch (err) {
            console.error("Failed to update status, reverting", err);
            setBackendApps(previous);
        }
    }


    async function updateApplication(
        request: UpdateApplicationRequest,
        id: number
    ) {
        const previous = structuredClone(backendApps);

        try {
            const updatedApp = await updateApplicationApi(id, request);

            setBackendApps(prev =>
                prev.map(app =>
                    app.id === id ? updatedApp : app
                )
            );
        } catch (error) {
            console.error("Failed to update application, reverting", error);
            setBackendApps(previous);
        }
    }


    async function updateApplicationNotes(notes: string, id: number) {

        try {
            const updated = await updateApplicationNotesApi(id, notes);

            setBackendApps(prev =>
                prev.map(app =>
                    app.id === id ? updated : app
                )
            );
        } catch (error) {
            console.error("error updating notes", error);
        }
    }

    async function fetchJobPostEnrichment(url: string): Promise<Enrichment> {
        return await fetchJobPostingEnrichmentApi(url);
    }

    async function loadMore() {
        if (!hasMore || isLoading) return;
        await loadApps()
    }


    return (
        <BrowserRouter>
            <Layout>
                <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" replace/>}/>
                    <Route path="/dashboard"
                           element={<DashboardPage
                               backendApps={backendApps}
                               handleSubmit={createApplication}
                               handleEdit={updateApplication}
                               handleDelete={deleteApplication}
                               handleUpdateNotes={updateApplicationNotes}
                               isLoading={isLoading} onAutofill={fetchJobPostEnrichment}
                               getStatusHistory={getStatusHistory}
                               onLoadMore={loadMore}
                               hasMore={hasMore}
                           />

                           }/>
                    <Route path="/pipeline" element={
                        <PipelinePage backendApps={backendApps}
                                      onStatusChange={updateApplicationStatus}
                                      onUpdateNotes={updateApplicationNotes}
                                      getStatusHistory={getStatusHistory}
                        />}
                    />
                    {/*<Route path="/settings" element={<SettingsPage/>}/>*/}
                </Routes>
            </Layout>
        </BrowserRouter>
    );
}

