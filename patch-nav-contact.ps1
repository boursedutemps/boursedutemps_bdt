# patch-nav-contact.ps1
# Ajoute nav.contact dans tous les fichiers de langue
# Run from: P:\Mes Projets\boursedutemps

$navContact = @{
  "fr" = "Contact"
  "en" = "Contact"
  "ht" = "Kontakte"
  "es" = "Contacto"
  "pt" = "Contato"
  "de" = "Kontakt"
  "it" = "Contatto"
  "nl" = "Contact"
  "tr" = "Iletisim"
  "sw" = "Wasiliana"
  "wo" = "Jokkoo"
  "ar" = "تواصل"
  "ru" = "Контакт"
  "zh" = "联系"
  "ja" = "お問い合わせ"
  "ko" = "연락처"
  "hi" = "संपर्क"
}

$count = 0
foreach ($lang in $navContact.Keys) {
    $file = "messages\$lang.json"
    if (!(Test-Path $file)) { Write-Host "SKIP $lang"; continue }
    $content = [System.IO.File]::ReadAllText((Resolve-Path $file).Path, [System.Text.Encoding]::UTF8)

    # Cherche "notifications": "..." dans la section nav et ajoute contact juste avant
    $old = '"notifications":'
    if ($content -notmatch '"nav\.contact"' -and $content -match $old) {
        $val = $navContact[$lang]
        $content = $content -replace [regex]::Escape('"notifications":'), "`"contact`": `"$val`",`n    `"notifications`":"
        [System.IO.File]::WriteAllText((Resolve-Path $file).Path, $content, [System.Text.Encoding]::UTF8)
        Write-Host "OK: $lang"
        $count++
    } else {
        Write-Host "SKIP $lang (deja present ou non trouve)"
    }
}
Write-Host ""
Write-Host "Done! $count files patched."
