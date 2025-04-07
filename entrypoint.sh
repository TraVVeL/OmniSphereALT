#!/bin/sh
mc alias set myminio http://minio:9000 $MINIO_ROOT_USER $MINIO_ROOT_PASSWORD
mc mb myminio/$MINIO_BUCKET_NAME || true
exec minio server --console-address ":9001" /data
