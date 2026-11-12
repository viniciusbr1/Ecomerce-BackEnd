$envFile = ".env"

if (!(Test-Path $envFile)) {
    Write-Host "Arquivo .env nao encontrado."
    exit 1
}

Get-Content $envFile | ForEach-Object {

    $linha = $_.Trim()

    if ($linha -and !$linha.StartsWith("#")) {

        $partes = $linha -split "=", 2

        if ($partes.Length -eq 2) {

            $nome = $partes[0].Trim()
            $valor = $partes[1].Trim()

            [Environment]::SetEnvironmentVariable(
                $nome,
                $valor,
                "Process"
            )
        }
    }
}

Write-Host "Variaveis carregadas."
Write-Host "Iniciando Spring Boot..."

.\mvnw.cmd spring-boot:run