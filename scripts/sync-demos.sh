#!/bin/sh
# Copia o site Maré Alta (repositório ao lado: ../mare-alta) para public/demos/mare-alta,
# para ficar acessível em /demos/mare-alta/ no mesmo deploy do portefólio.
# Correr sempre que o Maré Alta mudar:  npm run sync:demos
set -e
ORIGEM="$(cd "$(dirname "$0")/../.." && pwd)/mare-alta"
DESTINO="$(cd "$(dirname "$0")/.." && pwd)/public/demos/mare-alta"

if [ ! -f "$ORIGEM/index.html" ]; then
  echo "Não encontrei $ORIGEM/index.html" >&2
  exit 1
fi

mkdir -p "$DESTINO"
rsync -a --delete \
  --exclude '.git' --exclude '.gitignore' --exclude '.claude' --exclude '.DS_Store' --exclude 'README.md' \
  "$ORIGEM/" "$DESTINO/"
echo "Maré Alta copiado para public/demos/mare-alta ($(find "$DESTINO" -type f | wc -l | tr -d ' ') ficheiros)"
