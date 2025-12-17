import './App.css'
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import {DashboardPage} from "./pages/DashboardPage.tsx";
import {Layout} from "./components/layout/Layout.tsx";
import {PipelinePage} from "./pages/PipelinePage.tsx";
import {useEffect, useState} from "react";
import type {Application, ApplicationRequest} from "./types/application.ts";
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

    async function loadApps() {
        setIsLoading(true);
        const data = await getApplications();
        setAllApps(data)
        setIsLoading(false);
    }

    async function handleSubmit(request: ApplicationRequest) {
        const newApp = await createApplication(request);

        console.log(newApp);
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
        status: string,
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


    async function handleEdit(request: ApplicationRequest, id?: number) {
        try {
            if (id !== undefined) {
                await updateApplication(id, request);
            }

            setAllApps(prev =>
                prev.map(app =>
                    app.id === id
                        ? {...app, ...request} // merge new values into old item
                        : app
                )
            );

        } catch (error) {
            await loadApps(); // fallback if update failed
        }
    }

    async function handlePublishNotes(notes: string, id?: number) {
        try {
            if (id == undefined) return;
            console.log("updating notes: " + notes)
            await updateApplicationNotes(id, notes)
        } catch (error) {
            console.error("error updating notes")
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

