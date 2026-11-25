
# Dynamics 365 JavaScript Toolkit

![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-F7DF1E?logo=javascript&logoColor=black)
![Dynamics 365](https://img.shields.io/badge/Dynamics%20365-Customer%20Service-002050)
![Power Platform](https://img.shields.io/badge/Power%20Platform-Microsoft-742774)
![Dataverse](https://img.shields.io/badge/Dataverse-Web%20API-107C10)
![License](https://img.shields.io/badge/License-MIT-green)

## Overview

A collection of reusable JavaScript utilities and practical
development examples for Microsoft Dynamics 365 Customer
Service and Power Apps Model-Driven applications.

This repository focuses on client-side customization,
business process automation, case management, Dataverse
integrations, and enterprise CRM development.

## Technologies

- JavaScript (ES6+)
- Microsoft Dynamics 365 Customer Service
- Microsoft Power Platform
- Power Apps Model-Driven
- Microsoft Dataverse
- Xrm Client API
- Dataverse Web API
- FetchXML
- OData
- Ribbon Workbench
- Custom Actions

## Repository Structure

```text
dynamics365-javascript-toolkit/
├── src/
│   ├── field-visibility.js
│   ├── required-fields.js
│   ├── lookup-filter.js
│   ├── phone-mask.js
│   ├── web-api-retrieve.js
│   ├── form-validation.js
│   ├── tab-visibility.js
│   ├── case-ribbon-commands.js
│   ├── case-resolution.js
│   ├── case-open-tasks.js
│   ├── case-queue-routing.js
│   ├── case-sla-notification.js
│   ├── case-customer-history.js
│   ├── case-duplicate-validation.js
│   └── case-custom-action.js
├── LICENSE
└── README.md
```

## Features

### Form Customization

| File | Description |
| --- | --- |
| field-visibility.js | Dynamic field visibility |
| required-fields.js | Conditional required fields |
| lookup-filter.js | Custom lookup filtering using FetchXML |
| phone-mask.js | Brazilian phone number formatting |
| form-validation.js | Date range validation before saving |
| tab-visibility.js | Dynamic tab and section visibility |

### Dataverse Integration

| File | Description |
| --- | --- |
| web-api-retrieve.js | Asynchronous record retrieval using Web API |

### Customer Service and Case Management

| File | Description |
| --- | --- |
| case-ribbon-commands.js | Role-based command availability |
| case-resolution.js | Native case resolution using CloseIncident |
| case-open-tasks.js | Open task monitoring and pagination |
| case-queue-routing.js | Case routing using AddToQueue |
| case-sla-notification.js | SLA KPI monitoring and notifications |
| case-customer-history.js | Customer service history using FetchXML |
| case-duplicate-validation.js | Potential duplicate case detection |
| case-custom-action.js | Custom Action execution for case escalation |

## Technical Highlights

- Asynchronous programming with async/await
- Structured exception handling
- Dataverse record retrieval
- OData query optimization
- FetchXML queries
- Record pagination
- Form event management
- Dynamic form notifications
- Security role-based command rules
- Bound and unbound actions
- Case lifecycle management
- Queue management
- SLA KPI monitoring
- Custom business process integration

## Getting Started

### Prerequisites

- Microsoft Power Platform environment
- Microsoft Dataverse
- Dynamics 365 Customer Service
- Appropriate customization and security permissions

### Installation

1. Clone or download this repository.
2. Open your Power Platform solution.
3. Create a JavaScript Web Resource.
4. Upload the desired JavaScript file.
5. Add the Web Resource to the appropriate form.
6. Register the function in the corresponding event.
7. Enable the execution context parameter when required.
8. Save and publish the customizations.
9. Validate the implementation in a development environment.

For Ribbon commands, configure the JavaScript function
and the required CRM parameters using Ribbon Workbench
or compatible command customization tools.

## Development Practices

- Reusable JavaScript functions
- Namespace organization
- Defensive programming
- Input validation
- Error handling
- Separation of responsibilities
- Minimal data retrieval
- Descriptive function and variable names

## Security Considerations

Client-side validations and command visibility rules
do not replace server-side security.

Dataverse security roles, privileges, plugins, and
server-side validations should be used to enforce
critical business rules and data protection.

## Project Status

This repository contains educational and portfolio
examples intended for development environments.

The examples require environment-specific configuration
and validation before production use.

Custom fields, option values, security role names,
and custom actions may need to be adapted.

The demo_EscalateCase action requires a separate
server-side implementation.

## Official Documentation

- [Power Apps Client API](https://learn.microsoft.com/en-us/power-apps/developer/model-driven-apps/clientapi/reference)
- [Dataverse Web API](https://learn.microsoft.com/en-us/power-apps/developer/data-platform/webapi/overview)
- [Dynamics 365 Customer Service](https://learn.microsoft.com/en-us/dynamics365/customer-service/)
- [FetchXML](https://learn.microsoft.com/en-us/power-apps/developer/data-platform/fetchxml/overview)

## About the Author

Power Platform and Dynamics 365 Developer focused on
enterprise applications, CRM customization, business
process automation, and system integrations.

Professional interests include:

- Dynamics 365 Customer Service
- Microsoft Power Platform
- C# and .NET
- Azure Functions
- REST APIs
- Event-driven integrations
- Azure DevOps and ALM

## Disclaimer

All examples are independently developed for educational
and professional portfolio purposes.

This repository does not contain proprietary business
logic, confidential customer information, or corporate
credentials.

## License

This project is licensed under the MIT License.
See the LICENSE file for details.
