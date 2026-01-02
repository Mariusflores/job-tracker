import type {Application} from "./application.ts";

export type PipelineProps = {
    application: Application;
    onOpenDetails?: (id: number) => void;
    isOverlay?: boolean
}