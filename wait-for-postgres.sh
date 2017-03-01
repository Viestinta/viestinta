#!/bin/bash
# wait-for-postgres.sh

set -e

host="$1"
shift
cmd="$@"
sleep 7
>&2 echo "Postgres is up - executing command"
exec $cmd