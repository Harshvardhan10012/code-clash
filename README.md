# Firebase Studio - Code Clash App

This is a Next.js starter app for "Code Clash", an application where users can predict outcomes of coding challenges. It's built with Next.js, React, ShadCN UI, Tailwind CSS, and Genkit for AI features.

## Getting Started

1.  **Install dependencies:**
    ```bash
    npm install
    # or
    # yarn install
    # or
    # pnpm install
    ```

2.  **Set up Environment Variables:**
    Create a `.env.local` file in the root of your project (copy from `.env.example` if it exists, or create it) and add your Google AI API key:
    ```env
    GOOGLE_AI_API_KEY=your_google_ai_api_key_here
    ```
    Ensure `.env.local` is added to your `.gitignore` file.

3.  **Run the development server for Next.js:**
    ```bash
    npm run dev
    ```
    This will start the Next.js app, typically on `http://localhost:9002`.

4.  **Run the Genkit development server (in a separate terminal):**
    Your AI flows (defined in `src/ai/flows/`) are managed by Genkit. To make them available during development:
    ```bash
    npm run genkit:dev
    # or for auto-reloading on changes
    # npm run genkit:watch
    ```
    This usually starts the Genkit developer UI on `http://localhost:4000`.

Open [http://localhost:9002](http://localhost:9002) with your browser to see the Next.js application.

## Project Structure

-   `src/app/`: Next.js App Router pages and layouts.
-   `src/components/`: Reusable React components, including ShadCN UI components in `src/components/ui/`.
-   `src/lib/`: Utility functions and mock data (`mock-data.ts`).
-   `src/ai/`: Genkit related code.
    -   `src/ai/genkit.ts`: Genkit initialization.
    -   `src/ai/flows/`: Genkit AI flows.
    -   `src/ai/dev.ts`: Entry point for `genkit start`.
-   `src/hooks/`: Custom React hooks.
-   `src/types/`: TypeScript type definitions.
-   `public/`: Static assets.

## Production Considerations

### 1. Building the Next.js App
To create a production-ready build of your Next.js application, run:
```bash
npm run build
```
This command compiles your application and optimizes it for production.

### 2. Starting the Production Server
After building, you can start the production server using:
```bash
npm run start
```
This command runs the optimized Next.js server.

### 3. Environment Variables
For production, **DO NOT** commit your actual API keys or sensitive information to your repository. Use your hosting provider's interface to set environment variables. The application will expect `GOOGLE_AI_API_KEY` to be available in the environment where it runs.

### 4. Data Persistence
The current application uses `src/lib/mock-data.ts` for challenges, users, and predictions. For a production environment, this **must** be replaced with a persistent database solution, such as:
-   Firebase Firestore
-   Supabase
-   PostgreSQL (e.g., with Neon, Railway, or AWS RDS)
-   MongoDB (e.g., MongoDB Atlas)
You will need to implement services to interact with your chosen database.

### 5. Deploying Genkit Flows
The `genkit:dev` and `genkit:watch` scripts are for local development. For production, your Genkit flows need to be deployed to a server environment. Common options include:
-   **Firebase Cloud Functions:** If you are using Firebase, this is a natural fit.
-   Other serverless platforms (AWS Lambda, Google Cloud Functions, etc.).
-   A dedicated Node.js server.

Consult the Genkit documentation for deployment guides relevant to your chosen infrastructure.

### 6. Hosting
Choose a hosting platform suitable for Next.js applications:
-   **Vercel:** Highly recommended for Next.js, offers seamless integration.
-   **Netlify:** Another popular choice for Jamstack sites.
-   **AWS Amplify:** For deploying full-stack serverless web apps.
-   **Google Cloud Run / App Engine:** For containerized applications or Node.js environments.
-   **Firebase Hosting:** Can host Next.js apps, often paired with Cloud Functions for server-side logic.

### 7. Security, Logging, Monitoring
-   Ensure your application is served over **HTTPS**.
-   Implement robust error logging and application monitoring (e.g., Sentry, New Relic, Datadog).
-   Regularly update dependencies.
-   Perform security audits.

### 8. Custom Assets
Replace placeholder images (`https://placehold.co/...`) with professional, relevant images for your application.

This list provides a starting point. Making an application "production-level" is an ongoing process of improvement and maintenance.
```
![image](https://github.com/user-attachments/assets/5424376f-248d-494d-9516-074b705fe57f)
