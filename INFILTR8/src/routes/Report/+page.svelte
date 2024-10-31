<h1 class="flex justify-center"></h1>

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
    const fileTypes = ['PDF', 'XML']; 

    function exportData() {
        // Export logic here
    }
</script>

<div class="grid grid-cols-[250px_1fr_350px] h-screen font-sans">
    <main class="p-8 overflow-y-auto">
        <div class="flex items-center mb-4">
            <a href="#" class="text-2xl font-bold"><span>Lo</span>gs</a>
        </div>
        <h1 class="text-center text-3xl font-semibold mb-4">Reports</h1>

        <div class="flex items-center bg-blue-900 text-white rounded-xl shadow-md p-4 mb-4 hover:scale-105 hover:shadow-lg transition-transform">
            <div class="flex items-center justify-center w-12 h-12">
                <img src="https://img.icons8.com/ios-filled/50/000000/folder-invoices.png" alt="Folder Icon" />
            </div>
            <div class="ml-4">
                <h2 class="text-lg font-semibold">{folder.name}</h2>
                <p class="text-sm text-gray-400">{folder.items} items | {folder.size}</p>
            </div>
            <div class="ml-auto text-gray-400 text-lg">⋮</div>
        </div>

        <h2 class="text-xl font-semibold mb-4">IP List</h2>
        <div class="grid grid-cols-[0.1fr_1fr_1fr_2fr_1fr] p-2 bg-gray-800 text-white rounded-md mb-2">
            <span class="text-left">Select</span> 
            <span class="text-left">IP Address</span>
            <span class="text-left">Device</span>
            <span class="text-left">Vulnerability</span>
            <span class="text-left">Status</span>
        </div>

        <ul class="space-y-2">
            {#each ipList as item}
                <li class="grid grid-cols-[0.1fr_1fr_1fr_2fr_1fr] p-2 bg-gray-900 text-white rounded-md items-center hover:bg-gray-700 transition-colors">
                    <span>
                        <input type="checkbox" class="mr-2 scale-110">
                    </span>
                    <span class="truncate">{item.ip}</span>
                    <span class="truncate">{item.device}</span>
                    <span class="truncate">{item.vulnerability}</span>
                    <span class="truncate">{item.status}</span>
                </li>
            {/each}
        </ul>

        <div class="flex items-center justify-between mt-6">
            <div class="flex flex-col">
                <label for="fileType" class="text-white mb-2">Select file type:</label>
                <select id="fileType" class="bg-gray-900 text-white p-2 rounded-md border border-gray-600" bind:value={selectedFileType}>
                    <option value="" disabled>Select File Type</option>
                    {#each fileTypes as fileType}
                        <option value={fileType}>{fileType}</option> 
                    {/each}
                </select>
            </div>
        
            <button on:click={exportData} class="bg-gray-900 text-white px-4 py-2 rounded-md border border-gray-600 hover:bg-gray-700 transition-colors">
                Export
            </button>
        </div>
    </main>
</div>