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
    UpdateApplicationRequest
} from "./types/application.ts";
import {
    createApplication,
    deleteApplication,
    getApplications,
    updateApplication,
    updateApplicationNotes,
    updateApplicationStatus
} from "./api/applications.ts";

export default function App() {
    const [allApps, setAllApps] = useState<Application[]>([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        loadApps();
    }, []);

    useEffect(() => {
        if (import.meta.env.DEV) {
            allApps.forEach(app => {
                if (!["APPLIED", "INTERVIEW", "OFFER", "REJECTED"].includes(app.status)) {
                    throw new Error(`Invalid status detected: ${app.status}`);
                }
            });
        }

    }, [allApps]);


    async function loadApps() {
        setIsLoading(true);
        const data = await getApplications();
        setAllApps(data)
        setIsLoading(false);
    }

    async function handleSubmit(request: CreateApplicationRequest) {
        const newApp = await createApplication(request);
        setAllApps(prev => [...prev, newApp]);
    }

    async function handleDelete(id: number) {
        setAllApps(prev => prev.filter(app => app.id !== id));

        try {
            await deleteApplication(id);
        } catch (error) {
            await loadApps();
        }
    }

    async function handleUpdateStatusOptimistic(
        status: ApplicationStatus,
        id: number
    ) {
        // Snapshot for rollback
        const previous = allApps;

        // 1. Optimistic update (status only)
        setAllApps(prev =>
            prev.map(app =>
                app.id === id ? {...app, status} : app
            )
        );

        // 2. Backend call
        try {
            await updateApplicationStatus(id, status);
        } catch (err) {
            console.error("Failed to update status, reverting", err);
            setAllApps(previous);
        }
    }


    async function handleEdit(
        request: UpdateApplicationRequest,
        id: number
    ) {
        // Snapshot for rollback
        const previous = structuredClone(allApps);

        try {
            // 1. Backend update
            await updateApplication(id, request);

            // 2. Optimistic local update (safe partial merge)
            setAllApps(prev =>
                prev.map(app =>
                    app.id === id
                        ? {...app, ...request}
                        : app
                )
            );
        } catch (error) {
            console.error("Failed to update application, reverting", error);
            setAllApps(previous);
        }
    }


    async function handlePublishNotes(notes: string, id?: number) {
        if (!id) return;

        try {
            await updateApplicationNotes(id, notes);

            setAllApps(prev =>
                prev.map(app =>
                    app.id === id
                        ? {...app, notes}
                        : app
                )
            );

        } catch (error) {
            console.error("error updating notes", error);
        }
    }


    return (
        <BrowserRouter>
            <Layout>
                <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" replace/>}/>
                    <Route path="/dashboard"
                           element={<DashboardPage
                               allApps={allApps}
                               handleSubmit={handleSubmit}
                               handleEdit={handleEdit}
                               handleDelete={handleDelete}
                               handlePublishNotes={handlePublishNotes}
                               isLoading={isLoading}
                           />

                           }/>
                    <Route path="/pipeline" element={<PipelinePage applications={allApps}
                                                                   onStatusChange={handleUpdateStatusOptimistic}/>}/>
                    {/*<Route path="/settings" element={<SettingsPage/>}/>*/}
                </Routes>
            </Layout>
        </BrowserRouter>
    );
}

