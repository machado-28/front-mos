
export const handleFileChange = (event, { setError, setFile },) => {
    const MAX_FILE_SIZE = 2048
    const file = event.target.files[0];
    if (file) {
        const fileSizeInBytes = file.size;
        // Convertendo bytes para kilobytes
        const fileSizeInKB = fileSizeInBytes / 1024;
        if (fileSizeInKB > MAX_FILE_SIZE) {
            // 2MB em KB
            setError("O arquivo não pode ter mais de 2MB.");
            console.log("ERRO:", fileSizeInKB,);
            return

        } else {
            console.log("SIZE", fileSizeInBytes);
            // setFileSize(prev => [...prev, fileSizeInBytes]);
            // (event.target.files[0].userId = Number(event.target.id)),
            setFile((prev) => [...prev, event.target.files[0]]);
            setError("");
            return
        }
    }
};
export const formatFileSize = (sizeInBytes = 0) => {
    const units = ["B", "KB", "MB", "GB", "TB"];
    let size = sizeInBytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
    }

    return `${size.toFixed(2)} ${units[unitIndex]}`;
};