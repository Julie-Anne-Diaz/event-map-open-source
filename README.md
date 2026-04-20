# Loop — Event Map

A platform to create, map, and share events with your community, all in one place.

## Tech Stack

- **Frontend:** Next.js 16 (App Router), Tailwind CSS, TanStack Query
- **Backend:** FastAPI (Python)
- **Database:** PostgreSQL + PostGIS
- **Auth:** JWT (email/password)
- **Maps:** OpenStreetMap + MapLibre GL JS

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+
- PostgreSQL 18

### Frontend Setup

```bash
git clone https://github.com/Julie-Anne-Diaz/event-map-open-source.git
cd event-map-open-source
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Backend Setup

```bash
cd api
pip install -r requirements.txt
```

Create a `.env` file inside the `api/` folder:
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/eventmap
SECRET_KEY=yoursecretkey

Then run the server:

```bash
python -m uvicorn main:app --reload --port 8010
```

API docs available at [http://localhost:8010/docs](http://localhost:8010/docs)

## Project Structure

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/login` | Login page |
| `/events` | Events feed |
| `/map` | Map view |
| `/friends` | Friends list |
| `/profile` | User profile |
| `/create-event` | Create a new event |

## Contributing

1. Fork the repo
2. Create a new branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a pull request

## Team

| Name | Role |
|------|------|
| Fernando Colimon | Frontend Developer |
| Sebastien Laguerre | Backend Developer |
| Julian Diaz | Database & Modeling |
