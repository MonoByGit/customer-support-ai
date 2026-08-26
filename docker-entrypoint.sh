#!/bin/sh
set -e

# Railway mount een volume als root, terwijl de app als 'nextjs' (uid 1001) draait.
# Zonder deze stap faalt elke schrijfactie met EACCES en is er geen persistentie.
# We starten daarom als root, maken de map schrijfbaar, en laten daarna de
# rechten weer vallen — de applicatie zelf draait nooit als root.
if [ -n "$DATA_DIR" ]; then
  case "$DATA_DIR" in
    REPLACE_ME*)
      echo "[entrypoint] DATA_DIR bevat nog een placeholder; persistentie overgeslagen."
      ;;
    *)
      mkdir -p "$DATA_DIR/profiles" "$DATA_DIR/sessions"
      chown -R nextjs:nodejs "$DATA_DIR"
      echo "[entrypoint] DATA_DIR $DATA_DIR gereed en schrijfbaar voor nextjs."
      ;;
  esac
fi

exec su-exec nextjs "$@"
