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
        const previous = structuredClone(allApps);

        setAllApps(prev =>
            prev.map(app =>
                app.id === id ? {...app, status} : app
            )
        );

        try {
            const updated = await updateApplicationStatus(id, status);

            setAllApps(prev =>
                prev.map(app =>
                    app.id === id ? updated : app
                )
            );
        } catch (err) {
            console.error("Failed to update status, reverting", err);
            setAllApps(previous);
        }
    }


    async function handleEdit(
        request: UpdateApplicationRequest,
        id: number
    ) {
        const previous = structuredClone(allApps);

        try {
            const updatedApp = await updateApplication(id, request);

            setAllApps(prev =>
                prev.map(app =>
                    app.id === id ? updatedApp : app
                )
            );
        } catch (error) {
            console.error("Failed to update application, reverting", error);
            setAllApps(previous);
        }
    }


    async function handlePublishNotes(notes: string, id: number) {

        try {
            const updated = await updateApplicationNotes(id, notes);

            setAllApps(prev =>
                prev.map(app =>
                    app.id === id ? updated : app
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
                               backendApps={allApps}
                               handleSubmit={handleSubmit}
                               handleEdit={handleEdit}
                               handleDelete={handleDelete}
                               handlePublishNotes={handlePublishNotes}
                               isLoading={isLoading}
                           />

                           }/>
                    <Route path="/pipeline" element={<PipelinePage backendApps={allApps}
                                                                   onStatusChange={handleUpdateStatusOptimistic}
                                                                   onPublishNotes={handlePublishNotes}
                    />}/>
                    {/*<Route path="/settings" element={<SettingsPage/>}/>*/}
                </Routes>
            </Layout>
        </BrowserRouter>
    );
}

