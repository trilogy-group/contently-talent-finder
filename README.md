# Talent Finder

A modern web application for finding and filtering talent profiles based on various criteria. This application allows users to search for talent using natural language queries, filters, and content strategy templates.

## Features

- **Natural Language Search**: Ask questions in plain English to find talent that matches your needs
- **Advanced Filtering**: Filter talent by role, industry, specialty, experience, and more
- **Voice Input**: Use voice commands to search for talent
- **Content Strategy Templates**: Apply pre-defined content strategies to find the right talent for specific projects
- **Responsive Design**: Works on desktop and mobile devices

## Technology Stack

- React
- TypeScript
- Tailwind CSS
- Shadcn UI Components
- Speech Recognition API
- AWS S3 (for hosting)
- AWS Lambda (for backend services)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- AWS CLI (for deployment)

### Installation

1. Clone the repository
```bash
git clone https://github.com/trilogy-group/contently-talent-finder.git
cd talent-finder
```

2. Install dependencies
```bash
npm install
# or
yarn
```

3. Start the development server
```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:5173` or the port shown in your terminal

## Usage

### Search for Talent

- Use the chat interface to describe what you're looking for in natural language
- Click the microphone button to use voice input
- Your query will automatically set appropriate filters based on your requirements

### Apply Filters

- Use the filters sidebar to manually set specific criteria
- Adjust sliders for experience, score, and project requirements
- Select specific roles, industries, and specialties

### Content Strategies

- Select a pre-defined content strategy to automatically set filters for specific project types
- Customize the strategy settings as needed

## Deployment

### Deploying to AWS S3

The application can be deployed to AWS S3 for static web hosting using the included deployment script:

```bash
# Make sure the script is executable
chmod +x deploy-react.sh

# Deploy with default settings
./deploy-react.sh

# Or specify a custom AWS profile and bucket
./deploy-react.sh --profile your-aws-profile --bucket your-bucket-name
```

This will:
1. Create an S3 bucket if it doesn't exist
2. Configure the bucket for public web hosting
3. Build the React application
4. Upload the built files to the S3 bucket
5. Output the website URL

### Backend Deployment

The application includes Lambda functions that can be deployed using the provided scripts:

```bash
# Deploy the proxy Lambda function
cd proxy-lambda
./deploy.sh

# Deploy the bastion Lambda function
cd bastion-lambda
./deploy.sh
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
