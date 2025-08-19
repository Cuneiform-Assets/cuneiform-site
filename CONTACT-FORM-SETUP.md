# Contact Form Integration Setup Guide

This guide will help you set up the contact form integration with Airtable and automated email responses.

## Overview

The contact form integration includes:
- Form submissions saved to Airtable
- Automated email responses to form submitters
- Serverless function handling via Vercel/GitHub Pages

## Step 1: Airtable Setup

### 1.1 Create Your Airtable Base

1. **Create a new base** in Airtable or use your existing one
2. **Create a table** called "Contacts" (or use your preferred name)
3. **Add the following fields** with exact names:
   - `Name` (Single line text)
   - `Email` (Email)
   - `Subject` (Single line text)
   - `Message` (Long text)
   - `Submitted At` (Date and time)
   - `Status` (Single select with options: New, In Progress, Completed)

### 1.2 Get Your Airtable Credentials

1. **Get your Base ID**:
   - Go to https://airtable.com/api
   - Select your base
   - Copy the Base ID from the URL (starts with `app...`)

2. **Get your API Token**:
   - Go to https://airtable.com/create/tokens
   - Click "Create new token"
   - Give it a name like "Cuneiform Contact Form"
   - Add these scopes:
     - `data.records:read`
     - `data.records:write`
   - Select your base
   - Click "Create token"
   - **Copy and save this token securely**

## Step 2: EmailJS Setup (for automated responses)

### 2.1 Create EmailJS Account

1. Go to https://www.emailjs.com/
2. Create a free account
3. Go to the Dashboard

### 2.2 Set Up Email Service

1. Click "Add New Service"
2. Choose your email provider (Gmail recommended)
3. Follow the setup instructions
4. **Copy the Service ID**

### 2.3 Create Email Template

1. Click "Create New Template"
2. Use this template content:

```
Subject: Thank you for contacting {{from_name}}

Dear {{to_name}},

Thank you for reaching out to Cuneiform Assets Limited. We have received your message regarding "{{subject}}" and will get back to you soon.

Your submitted information:
- Name: {{to_name}}
- Email: {{to_email}}
- Subject: {{subject}}

Our team typically responds within 24-48 hours during business days.

Best regards,
Cuneiform Assets Limited Team
legal@cuneiformassets.io

---
This is an automated response. Please do not reply to this email.
```

3. **Copy the Template ID**
4. Go to Account settings and **copy your Public Key**

## Step 3: GitHub Secrets Configuration

### 3.1 Add Repository Secrets

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** for each of the following:

#### Required Secrets:

- **AIRTABLE_API_KEY**: Your Airtable API token
- **AIRTABLE_BASE_ID**: Your Airtable base ID (starts with `app...`)
- **AIRTABLE_TABLE_NAME**: `Contacts` (or your table name)

#### Optional Secrets (for automated emails):

- **EMAILJS_SERVICE_ID**: Your EmailJS service ID
- **EMAILJS_TEMPLATE_ID**: Your EmailJS template ID  
- **EMAILJS_PUBLIC_KEY**: Your EmailJS public key

### 3.2 Environment Setup

If using environments (recommended):

1. Go to **Settings** → **Environments**
2. Create environments: `github-pages` and `github-pages-dev`
3. Add the same secrets to each environment

## Step 4: Deploy Options

### Option A: Vercel Deployment (Recommended)

1. **Connect to Vercel**:
   - Go to https://vercel.com/
   - Import your GitHub repository
   - Vercel will automatically detect the configuration

2. **Add Environment Variables** in Vercel:
   - Go to your project settings
   - Add all the secrets as environment variables

3. **Deploy**: Vercel will automatically deploy your site with serverless functions

### Option B: Alternative Serverless Provider

If you prefer another provider (Netlify, AWS Lambda, etc.), you'll need to:
1. Adapt the serverless function for your provider
2. Update the API endpoint in the form JavaScript
3. Configure environment variables in your provider

## Step 5: Testing

### 5.1 Test the Form

1. Deploy your site
2. Fill out the contact form
3. Check your Airtable base for the new record
4. Check the email address you submitted for the automated response

### 5.2 Troubleshooting

#### Form not submitting:
- Check browser console for errors
- Verify the API endpoint is accessible
- Check environment variables are set correctly

#### Data not appearing in Airtable:
- Verify Airtable API key and base ID
- Check field names match exactly
- Review server logs for errors

#### No automated email:
- Verify EmailJS credentials
- Check EmailJS dashboard for failed sends
- Ensure template variables match

## Step 6: Monitoring

### 6.1 Airtable Monitoring

- Check your Airtable base regularly for new submissions
- Use Airtable's views and filters to organize submissions
- Set up Airtable automations if needed

### 6.2 Error Monitoring

- Monitor your serverless function logs
- Set up alerts for failed submissions
- Review GitHub Actions logs for deployment issues

## Security Notes

- Never commit API keys to your repository
- Use environment variables for all sensitive data
- Regularly rotate your API tokens
- Monitor your Airtable usage to prevent quota overages

## Support

If you encounter issues:
1. Check the browser console for JavaScript errors
2. Review the GitHub Actions logs
3. Verify all environment variables are set correctly
4. Test each component (Airtable, EmailJS) individually

## Example Airtable View

Your Contacts table should look like this:

| Name | Email | Subject | Message | Submitted At | Status |
|------|-------|---------|---------|--------------|--------|
| John Doe | john@example.com | Partnership Inquiry | I'm interested in... | 2024-01-15 10:30 AM | New |

## Next Steps

After setup:
1. Test the complete flow
2. Customize the email template
3. Set up Airtable automations for notifications
4. Consider adding form validation
5. Monitor submission volume and adjust quotas if needed