# Contact Form Setup Guide - Client-Side Integration

This guide shows you how to set up direct Airtable integration from your contact form without any serverless functions.

## 🚀 Quick Setup (15 minutes)

### Step 1: Set Up Airtable (5 minutes)

#### 1.1 Create Your Table
1. In your Airtable base, create a table called **"Contacts"** with these exact field names:
   - `Name` (Single line text)
   - `Email` (Email)
   - `Subject` (Single line text)
   - `Message` (Long text)
   - `Submitted At` (Date and time)
   - `Status` (Single select with options: New, In Progress, Completed)

#### 1.2 Get Your Credentials
1. **Get Base ID**:
   - Go to https://airtable.com/api
   - Select your base
   - Copy the Base ID (starts with `app...`)

2. **Get API Token**:
   - Go to https://airtable.com/create/tokens
   - Click "Create new token"
   - Name it "Cuneiform Contact Form"
   - Add scopes: `data.records:read` and `data.records:write`
   - Select your base
   - Copy the token

### Step 2: Set Up EmailJS (Optional - 5 minutes)

#### 2.1 Create Account & Service
1. Go to https://emailjs.com and create account
2. Add email service (Gmail recommended)
3. Copy the **Service ID**

#### 2.2 Create Email Template
1. Create new template with this content:

**Subject:** `Thank you for contacting {{from_name}}`

**Content:**
```
Dear {{to_name}},

Thank you for reaching out to Cuneiform Assets Limited. We have received your message regarding "{{original_subject}}" and will get back to you soon.

Your submitted information:
- Name: {{to_name}}
- Email: {{to_email}}
- Subject: {{original_subject}}

Our team typically responds within 24-48 hours during business days.

Best regards,
Cuneiform Assets Limited Team
legal@cuneiformassets.io

---
This is an automated response. Please do not reply to this email.
```

2. Copy the **Template ID**
3. Get your **Public Key** from Account settings

### Step 3: Update Your Website (5 minutes)

#### 3.1 Edit the Configuration
Open your `index.html` file and find this section around line 667:

```javascript
const CONFIG = {
    AIRTABLE_API_KEY: 'YOUR_AIRTABLE_API_KEY', // Replace with your API key
    AIRTABLE_BASE_ID: 'YOUR_AIRTABLE_BASE_ID', // Replace with your base ID
    AIRTABLE_TABLE_NAME: 'Contacts', // Replace if your table name is different
    EMAILJS_SERVICE_ID: 'YOUR_EMAILJS_SERVICE_ID', // Replace with EmailJS service ID
    EMAILJS_TEMPLATE_ID: 'YOUR_EMAILJS_TEMPLATE_ID', // Replace with EmailJS template ID
    EMAILJS_PUBLIC_KEY: 'YOUR_EMAILJS_PUBLIC_KEY' // Replace with EmailJS public key
};
```

#### 3.2 Replace the Placeholder Values

**Required (for Airtable):**
```javascript
AIRTABLE_API_KEY: 'patXXXXXXXXXXXXXX', // Your actual API token
AIRTABLE_BASE_ID: 'appXXXXXXXXXXXXXX', // Your actual base ID
AIRTABLE_TABLE_NAME: 'Contacts', // Keep as 'Contacts' unless you named it differently
```

**Optional (for automated emails):**
```javascript
EMAILJS_SERVICE_ID: 'service_XXXXXXX', // Your EmailJS service ID
EMAILJS_TEMPLATE_ID: 'template_XXXXXX', // Your EmailJS template ID
EMAILJS_PUBLIC_KEY: 'XXXXXXXXXXXX' // Your EmailJS public key
```

### Step 4: Deploy & Test

1. **Commit and push** your changes to GitHub
2. **Deploy** using your existing GitHub Actions workflow
3. **Test the form** by submitting a message
4. **Check Airtable** for the new record
5. **Check email** for the automated response

## ✅ What This Setup Does:

- **Form Submission**: Directly saves to your Airtable base
- **Automated Email**: Sends "thank you" email to form submitter
- **Validation**: Checks required fields and email format
- **User Feedback**: Shows success/error messages
- **No Server Needed**: Works entirely from the front-end

## 🔒 Security Considerations:

### API Key Exposure
⚠️ **Important**: Your Airtable API key will be visible in the browser's source code. To minimize risk:

1. **Use a restricted token** with minimal permissions (only `data.records:read` and `data.records:write`)
2. **Only grant access to the specific base** you need
3. **Monitor your Airtable usage** for unexpected activity
4. **Consider IP restrictions** if Airtable supports them for your plan

### Alternative Secure Approaches:
- Use a form service like Formspree, Netlify Forms, or Typeform
- Implement a simple serverless function (which we can help with if needed)
- Use Airtable's native form feature and embed it

## 🐛 Troubleshooting:

### Form not submitting:
1. Check browser console for errors
2. Verify API credentials are correct
3. Ensure field names match exactly in Airtable

### CORS errors:
- Airtable API supports CORS, so this shouldn't be an issue
- If you see CORS errors, check that your API token is valid

### No email being sent:
1. Verify EmailJS credentials
2. Check EmailJS dashboard for failed sends
3. Ensure template parameters match

### Data not appearing in Airtable:
1. Check API token permissions
2. Verify base ID and table name
3. Check field names match exactly

## 📝 Example Airtable Record:

After form submission, you should see records like this:

| Name | Email | Subject | Message | Submitted At | Status |
|------|-------|---------|---------|--------------|--------|
| John Doe | john@example.com | Partnership | I'm interested... | 2024-01-15 10:30 AM | New |

## 🎯 Next Steps:

1. **Test thoroughly** before going live
2. **Set up Airtable views** to organize submissions
3. **Create Airtable automations** for team notifications
4. **Monitor form submissions** regularly
5. **Consider backup solutions** for critical forms

## 💡 Pro Tips:

- **Test with real email addresses** to verify automated responses
- **Use Airtable's interface** to create a nice dashboard for managing submissions
- **Set up email notifications** in Airtable when new records are created
- **Create different views** in Airtable (New, In Progress, Completed)
- **Export data regularly** as a backup

This approach gives you a working contact form with Airtable integration and automated emails, all without needing any serverless infrastructure!