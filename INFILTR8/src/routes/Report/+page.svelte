<script>
    let folder = {
        name: "Current Folder",
        items: 63,
        size: "621 MB"
    };

    let ipList = [
        { ip: '192.168.1.1', device: 'Device A', vulnerability: 'CVE-2010-14800 {VPN TRAFFIC HIJACK}', status: 'Exploited' },
        { ip: '192.168.1.5', device: 'Device B', vulnerability: 'CVE-2022-21907 {HTTP PROTOCOL STACK}', status: 'Not Exploited' },
        { ip: '192.168.1.20', device: 'Device C', vulnerability: 'CVE-2024-122 {VPN TRAFFIC HIJACK}', status: 'Exploited' },
        { ip: '192.168.1.25', device: 'Device D', vulnerability: 'CVE-2016-14800 {VPN TRAFFIC HIJACK}', status: 'Not Exploited' },
    ];

    let selectedFileType = ''; 

    function exportData() {
        if (!selectedFileType) {
            alert("Please select a file type to export.");
            return;
        }
        alert(`Exporting data as ${selectedFileType}`);
    }
</script>

<main class="p-8 overflow-y-auto">
    <h1 class="text-center text-3xl font-semibold mb-4">Reports</h1>

    <div class="flex items-center bg-blue-900 text-white rounded-xl shadow-md p-4 mb-4 w-48 hover:scale-105 hover:shadow-lg transition-transform">
        <div>
            <h2 class="text-lg font-semibold text-center">{folder.name}</h2>
            <p class="text-sm text-gray-400 text-center">{folder.items} items | {folder.size}</p>
        </div>
    </div>

    <h2 class="text-xl font-semibold mb-4">IP List</h2>
    <div class="grid grid-cols-[0.1fr_1fr_1fr_2fr_1fr] p-2 bg-gray-800 text-white rounded-md mb-2">
        <span>Select</span> 
        <span>IP Address</span>
        <span>Device</span>
        <span>Vulnerability</span>
        <span>Status</span>
    </div>

    <ul>
        {#each ipList as item}
            <li class="grid grid-cols-[0.1fr_1fr_1fr_2fr_1fr] p-2 bg-gray-900 text-white rounded-md items-center">
                <span><input type="checkbox" class="mr-2 scale-110"></span>
                <span>{item.ip}</span>
                <span>{item.device}</span>
                <span>{item.vulnerability}</span>
                <span>{item.status}</span>
            </li>
        {/each}
    </ul>

    <div class="flex items-center justify-between mt-6">
        <div class="flex flex-col">
            <label for="fileType" class="text-white mb-2">Select file type:</label>
            <select id="fileType" class="bg-gray-900 text-white p-2 rounded-md border border-gray-600" on:change="{e => selectedFileType = e.target.value}">
                <option value="">Select File Type</option>
                <option value="PDF">PDF</option>
                <option value="XML">XML</option>
            </select>
        </div>

        <button on:click="{exportData}" class="bg-gray-900 text-white px-4 py-2 rounded-md border border-gray-600">
            Export
        </button>
    </div>
</main>