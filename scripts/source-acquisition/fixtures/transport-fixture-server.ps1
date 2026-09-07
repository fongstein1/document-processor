[CmdletBinding()]
param([Parameter(Mandatory)][int]$Port)

$ErrorActionPreference = 'Stop'
$listener = [Net.HttpListener]::new()
$listener.Prefixes.Add("http://127.0.0.1:$Port/")
$listener.Start()
Write-Output 'READY'
[Console]::Out.Flush()
try {
    while ($true) {
        $context = $listener.GetContext()
        $path = $context.Request.Url.AbsolutePath
        $body = [Text.Encoding]::ASCII.GetBytes(('%PDF-1.7`n' + ('fixture`n' * 100) + '%%EOF'))
        $context.Response.StatusCode = 200
        $context.Response.ContentType = 'application/pdf'
        if ($path -eq '/always-403') {
            $context.Response.StatusCode = 403
            $context.Response.ContentType = 'text/html; charset=UTF-8'
            $body = [Text.Encoding]::UTF8.GetBytes('<html><body>denied</body></html>')
        }
        elseif ($path -eq '/requires-accept' -and $context.Request.Headers['Accept'] -ne '*/*') {
            $context.Response.StatusCode = 403
            $context.Response.ContentType = 'text/html; charset=UTF-8'
            $body = [Text.Encoding]::UTF8.GetBytes('<html><body>missing standard accept</body></html>')
        }
        elseif ($path -eq '/redirect') {
            $context.Response.StatusCode = 302
            $context.Response.RedirectLocation = '/payload'
            $body = [byte[]]::new(0)
        }
        elseif ($path -eq '/html') {
            $context.Response.ContentType = 'text/html; charset=UTF-8'
            $body = [Text.Encoding]::UTF8.GetBytes(('<html><body>' + ('error page ' * 100) + '</body></html>'))
        }
        $context.Response.ContentLength64 = $body.Length
        $context.Response.OutputStream.Write($body, 0, $body.Length)
        $context.Response.Close()
    }
}
finally { $listener.Stop(); $listener.Close() }
