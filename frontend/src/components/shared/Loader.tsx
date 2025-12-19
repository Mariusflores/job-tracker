export default function Loader({isLoading}: { isLoading: boolean }) {
    if (!isLoading) return null;

    return (
        <div className={"flex justify-center items-center p-4"}>
            <div className="h-8 w-8
            rounded-full
            border-4
            border-gray-300
            border-t-blue-600
            animate-spin
            ">

            </div>

        </div>
    )
}