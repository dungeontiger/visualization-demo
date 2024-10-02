source visualization_demo/.env
python3 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
docker run -p 5432:5432 --name demo-postgres -e POSTGRES_PASSWORD=${POSTGRES_PASSWORD} -d postgres