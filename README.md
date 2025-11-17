# File Search Application

A Next.js application for managing Gemini file search stores: create stores, upload documents, and query content with AI-powered search.

## Features

- 📁 **Store Management**: Create and manage file search stores
- 📤 **File Upload**: Drag-and-drop file upload with progress tracking
- 🔍 **AI Search**: Query documents with natural language using Gemini
- 📊 **Dashboard**: Overview of all stores and recent activity
- 🎨 **Clean UI**: Professional design with shadcn/ui components

## Tech Stack

- **Next.js 16** - React framework with App Router
- **React Query** - Server state management
- **Axios** - HTTP client
- **shadcn/ui** - UI component library
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **React Markdown** - Markdown rendering

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- FastAPI backend running (see backend setup)

### Installation

1. Clone the repository and install dependencies:

```bash
npm install
```

2. Create a `.env.local` file:

```bash
cp .env.local.example .env.local
```

3. Update the `.env.local` file with your FastAPI backend URL:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                      # Next.js App Router pages
│   ├── page.js              # Dashboard
│   ├── stores/              # Stores pages
│   │   ├── page.js         # All stores
│   │   └── [storeId]/      # Individual store
│   ├── upload/             # Upload page
│   ├── search/             # Search page
│   └── layout.js           # Root layout
├── components/
│   ├── layout/             # Layout components
│   │   └── Header.jsx
│   ├── stores/             # Store components
│   │   ├── StoreCard.jsx
│   │   ├── StoreList.jsx
│   │   ├── CreateStoreModal.jsx
│   │   └── DeleteStoreDialog.jsx
│   ├── upload/             # Upload components
│   │   └── FileUploader.jsx
│   ├── query/              # Search components
│   │   ├── QueryInput.jsx
│   │   ├── QueryResults.jsx
│   │   └── SourcesList.jsx
│   └── ui/                 # shadcn/ui components
├── lib/
│   ├── api/                # API clients
│   │   ├── client.js
│   │   ├── stores.js
│   │   ├── files.js
│   │   └── queries.js
│   ├── hooks/              # Custom hooks
│   │   ├── useStores.js
│   │   ├── useUpload.js
│   │   └── useQueryStore.js
│   ├── config.js           # Configuration
│   └── utils.js            # Utilities
```

## API Endpoints

The application integrates with the following FastAPI endpoints:

- `GET /api/stores` - List all file search stores
- `POST /api/stores` - Create a new store
- `POST /api/stores/{store_name}/files` - Upload a file
- `POST /api/stores/{store_name}/query` - Query a store
- `DELETE /api/stores` - Delete all stores
- `GET /health` - Health check

## Usage

### Creating a Store

1. Navigate to the Dashboard or Stores page
2. Click "New Store"
3. Enter a display name
4. Click "Create Store"

### Uploading Files

1. Go to the Upload page or a specific store
2. Select a store from the dropdown
3. Drag and drop a file or click to browse
4. Click "Upload File"

### Searching Documents

1. Navigate to the Search page or a store's Query tab
2. Select a store
3. Enter your question in the text area
4. Click "Search"
5. View the AI-generated response and sources

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | FastAPI backend URL | `http://localhost:8000` |

## License

MIT


## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
