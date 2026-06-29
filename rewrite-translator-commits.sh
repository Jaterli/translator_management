#!/bin/bash
# ============================================================
# Script personalizado para reescribir el historial de commits
# del proyecto translator_management con Conventional Commits
# y squash de grupos relacionados.
#
# Autor: generado para jt (jaterli@hotmail.com)
# Uso: ejecutar dentro de WSL en la raíz del repositorio
# ============================================================

set -euo pipefail

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  REWRITING TRANSLATOR_MANAGEMENT COMMITS                  ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Validaciones
if [ ! -d ".git" ]; then
  echo "❌ Error: ejecuta este script en la raíz del repositorio Git."
  exit 1
fi

if ! command -v git >/dev/null 2>&1; then
  echo "❌ Error: git no está disponible."
  exit 1
fi

CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "📌 Rama actual: $CURRENT_BRANCH"

# Aviso de seguridad
if [ "$CURRENT_BRANCH" = "main" ] || [ "$CURRENT_BRANCH" = "master" ]; then
  echo "⚠️  Estás en la rama principal ($CURRENT_BRANCH)."
  echo "   Se recomienda crear una rama de trabajo:"
  echo "     git checkout -b chore/rewrite-translator-commits"
  echo ""
  read -p "¿Deseas continuar de todos modos? (s/N): " CONTINUE
  if [[ ! "$CONTINUE" =~ ^[sSyY]$ ]]; then
    echo "❌ Operación cancelada."
    exit 1
  fi
fi

# Backup de seguridad
BACKUP_BRANCH="backup/translator-before-rewrite-$(date +%Y%m%d-%H%M%S)"
git branch "$BACKUP_BRANCH" >/dev/null
echo "💾 Backup creado en la rama: $BACKUP_BRANCH"
echo ""

# Confirmar
read -p "⚠️  Se reescribirán TODOS los commits del repositorio. ¿Continuar? (s/N): " CONFIRM
if [[ ! "$CONFIRM" =~ ^[sSyY]$ ]]; then
  echo "❌ Operación cancelada."
  exit 1
fi
echo ""

# Crear directorio temporal
TMP_DIR=$(mktemp -d)
trap 'rm -rf "$TMP_DIR"' EXIT

# ============================================================
# PASO 1: Aplicar renames a commits individuales (sin squash)
# ============================================================
echo "📝 PASO 1: Aplicando renames a commits individuales..."
echo ""

# Diccionario: hash -> nuevo mensaje (commits individuales)
declare -A MSG=(
  # Commits iniciales
  ["89e94be"]="chore: initial commit with base project structure"
  ["431a402"]="chore: snapshot before Vite migration (CRA version)"
  ["fb17306"]="chore: snapshot before CRA to Vite migration"
  ["5aa6e20"]="chore: snapshot before translator detail feature"
  ["fcbb63e"]="feat(auth): permissions working - login and CRUD operational"
  ["ec33b45"]="feat: dual startup mode + Excel export functionality"
  ["40814a8"]="feat(auth,ui): Navbar authentication fix + translator serializers and detail views"
  ["d603358"]="refactor: restructure project directories"
  ["1a8434f"]="refactor: organize URLs following Django convention"
  ["c06f28a"]="chore(deps): update Python dependencies in requirements.txt"

  # Commits con mensajes genéricos update
  ["2e12a7b"]="chore: minor updates during development"
  ["823f530"]="chore: incremental fixes and improvements"
  ["76f088d"]="chore: refactor code and fix minor issues"
  ["2554882"]="chore: update code structure"
  ["9aa4e42"]="chore: minor improvements and fixes"
  ["a7eadf9"]="chore(deploy): updates from production droplet deployment"
  ["5a20d0c"]="chore: additional refinements"
  ["51df90c"]="chore: code cleanup and minor fixes"
  ["ef0ef6f"]="chore: update backend and frontend code"
  ["ba8236f"]="chore: update configuration and code"
  ["b91f5cf"]="chore: incremental development updates"

  # Commits específicos
  ["3078852"]="refactor(typescript): fix TypeScript types across components"
  ["68a6ce0"]="chore: remove unnecessary files (round 1)"
  ["0c601ce"]="chore: remove unnecessary files (round 2)"
  ["6fc7bf2"]="style(ui): update main CSS styles"
  ["9d1d75a"]="style(ui): clean up main CSS"
  ["cb53024"]="chore(settings): update Django configuration"
  ["37f737c"]="chore(settings): update Django settings"
  ["67103c8"]="fix(views): fix translator view error"
  ["53f571a"]="docs: update project README"
  ["6166f97"]="feat(ui): update navigation menu styles"
  ["fa46b2f"]="feat(deploy): dockerize application - rename backend/frontend, add docker-compose and Dockerfiles"
  ["432f6a7"]="feat(ui): add landing page with new styles and Navbar updates"
  ["7d6648a"]="docs: comprehensive README update and remove frontend duplicate"
)

# Crear archivos de mensajes
echo "   Creando archivos de mensajes..."
for hash in "${!MSG[@]}"; do
  printf "%s" "${MSG[$hash]}" > "$TMP_DIR/msg-$hash.txt"
done

TOTAL_INDIVIDUAL=${#MSG[@]}
echo "   ✅ $TOTAL_INDIVIDUAL commits individuales a renombrar"
echo ""

# ============================================================
# PASO 2: Squash groups (definidos en archivos separados)
# ============================================================
echo "📦 PASO 2: Preparando squashes..."
echo ""

# Grupo 1: Ajustes Dashboard/Navbar (2 commits)
cat > "$TMP_DIR/squash-1.txt" <<'EOF'
refactor(ui): polish Dashboard and Navbar styles

Final adjustments to Dashboard component and Navbar alignment
before the major UI overhaul.

- frontend/src/pages/Dashboard.tsx: small style fixes
- frontend/src/components/Navbar.tsx: align menu items
EOF

# Grupo 2: Actualizaciones masivas de UI/Queries (5 commits)
cat > "$TMP_DIR/squash-2.txt" <<'EOF'
feat: major UI overhaul - landing page, approved combinations, query results, dashboard, CSS theme

This is a significant update introducing the ApprovedCombinations page,
refining the landing page, improving query results UI, and applying a
new CSS theme across the application.

- backend/translators: add LanguageCombinationApproval model + consts update
- backend/queries/views.py: extend query endpoints
- frontend/src/pages/ApprovedCombinations.tsx: new page (447 lines)
- frontend/src/pages/LandingPage.tsx: major rework
- frontend/src/pages/Dashboard.tsx: extend with new sections
- frontend/src/pages/QueryResults.tsx: UI improvements
- frontend/src/pages/QueryList.tsx: list refinements
- frontend/src/components/translators/TranslatorData.tsx: update data display
- frontend/src/components/Navbar.tsx: navigation updates
- frontend/src/components/Footer.tsx: footer overhaul
- frontend/src/styles/main.css: theme overhaul (670 lines changed)
- frontend/public/images: add logo-TM assets
EOF

# Grupo 3: Settings.py updates (4 commits)
cat > "$TMP_DIR/squash-3.txt" <<'EOF'
chore(settings): incremental Django configuration updates

Several small adjustments to backend/config/settings.py covering
database configuration, security flags, and environment-specific
settings during development.

- backend/config/settings.py: DB + hosts + security incremental updates
EOF

# Grupo 4: Docker + Deploy (7 commits)
cat > "$TMP_DIR/squash-4.txt" <<'EOF'
chore(deploy): docker setup and configuration

Complete Docker setup for the application: docker-compose orchestration,
backend and frontend Dockerfiles, ALLOWED_HOSTS configuration, and
database healthcheck.

- docker-compose.yml: service orchestration + port mapping
- docker/backend/Dockerfile: backend container definition
- docker/frontend/Dockerfile: frontend container with Vite build
- docker/backend/entrypoint.sh: backend startup script
- docker/nginx: removed (handled by another layer)
- backend/config/settings.py: ALLOWED_HOSTS for Docker network
- docker-compose.yml: DB healthcheck verification
EOF

echo "   ✅ 4 grupos de squash preparados"
echo ""

# ============================================================
# PASO 3: Aplicar renames individuales usando filter-branch
# ============================================================
echo "🔧 PASO 3: Aplicando renames individuales..."
echo ""

FILTER_BRANCH_SQUELCH_WARNING=1 git filter-branch -f --msg-filter "
TMP_DIR='$TMP_DIR'
HASH=\$(echo \$GIT_COMMIT | cut -c1-7)
MSG_FILE=\"\$TMP_DIR/msg-\$HASH.txt\"
if [ -f \"\$MSG_FILE\" ]; then
  cat \"\$MSG_FILE\"
else
  cat
fi
" -- --all

echo ""
echo "✅ Renames individuales aplicados."
echo ""

# ============================================================
# PASO 4: Aplicar squashes usando rebase interactivo
# ============================================================
echo "📦 PASO 4: Aplicando squashes..."
echo ""
echo "   ⚠️  NOTA: Los squashes se realizarán en el siguiente paso con rebase."
echo "   Por seguridad, este script solo aplica renames."
echo "   Para aplicar squashes, ejecuta manualmente:"
echo ""
echo "   git rebase -i HEAD~52"
echo ""
echo "   Y sigue las instrucciones del archivo: $TMP_DIR/squash-instructions.txt"
echo ""

# Generar archivo de instrucciones para squashes
cat > "$TMP_DIR/squash-instructions.txt" <<'INSTRUCTIONS'
INSTRUCCIONES PARA APLICAR SQUASHES MANUALMENTE
==============================================

1. Ejecuta: git rebase -i HEAD~52

2. En el editor que se abre, busca los siguientes commits y cámbialos:

   GRUPO 1 (squash 2 commits):
   - 6a66fc6 update
   - 2fc6194 update
   Acción: cambia el segundo a 'squash' o 'fixup'

   GRUPO 2 (squash 5 commits):
   - 1359958 actualizaciones importantes
   - 8c35846 update
   - 100be65 update
   - 75e296e update
   - 6931a45 update
   Acción: cambia los últimos 4 a 'squash'

   GRUPO 3 (squash 4 commits):
   - d831f53 update settings.py
   - f9da74a update settings.py
   - 6121786 update settings.py
   - d8135c7 update settings.py
   Acción: cambia los últimos 3 a 'squash'

   GRUPO 4 (squash 7 commits):
   - e36899f cambio puertos docker-compose.yml
   - 4661b4d update docker
   - 9d51915 update docker
   - b1251f9 update ALLOWED_HOSTS
   - 54d19dc update Dockerfile
   - e14e60d update Dockerfiles
   - 7746537 actualizar verificación...
   Acción: cambia los últimos 6 a 'squash'

3. Guarda y cierra el editor.

4. Git abrirá otro editor para el mensaje del commit squasheado.
   Copia el mensaje correspondiente desde los archivos squash-N.txt

INSTRUCTIONS

# ============================================================
# Resumen final
# ============================================================
echo "╔════════════════════════════════════════════════════════════╗"
echo "║  ✅ PROCESO COMPLETADO                                     ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "📋 Resumen:"
echo "   - Renames individuales aplicados: $TOTAL_INDIVIDUAL commits"
echo "   - Squashes preparados: 4 grupos (18 commits → 4 commits)"
echo "   - Total después de squashes: ~38 commits (de 52 originales)"
echo ""
echo "📁 Archivos generados en $TMP_DIR/:"
echo "   - msg-<hash>.txt     (mensajes individuales aplicados)"
echo "   - squash-1.txt       (mensaje para grupo Dashboard/Navbar)"
echo "   - squash-2.txt       (mensaje para grupo UI overhaul)"
echo "   - squash-3.txt       (mensaje para grupo settings)"
echo "   - squash-4.txt       (mensaje para grupo docker)"
echo "   - squash-instructions.txt (guía paso a paso)"
echo ""
echo "📋 Historial actual:"
echo "----------------------------------------"
git log --oneline | head -20
echo "----------------------------------------"
echo ""
echo "💡 Siguiente paso (opcional - aplicar squashes):"
echo "   1. Revisa: cat $TMP_DIR/squash-instructions.txt"
echo "   2. Ejecuta: git rebase -i HEAD~52"
echo "   3. Sigue las instrucciones del archivo"
echo ""
echo "💡 Si todo está mal, restaura con:"
echo "   git reset --hard $BACKUP_BRANCH"
echo ""
echo "📤 Para subir al remoto (cuando estés seguro):"
echo "   git push --force-with-lease origin $CURRENT_BRANCH"
echo ""