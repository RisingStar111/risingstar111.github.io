Set-Location rust
wasm-pack build --target web
Set-Location ..
copy-item .\rust\pkg .\pages\pathology -force -recurse