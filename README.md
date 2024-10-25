# SBER beautiful code contest

This is a project for a contest: https://beautifulcode.ru/task/frontend#rules

Generally the app provides a way to manage personal budget:

- view transactions
- view expenses charts
- add transactions
- delete transactions
- edit transactions

## Setup

Make sure to install the dependencies:

```bash
npm install
```

## Development Server

Start the development server (nuxt app host) on `http://localhost:3001`:

```bash
npm run dev
```

## Mock data servers

Mock data (expense category metadata and transactions) can be served for
development using mock server (port 3000):

```bash
npm run mock-server:start
```

It starts json-server supporting basic CRUD operations on entities at the following routes:

- http://localhost:3000/category-metadata
- http://localhost:3000/transactions

Server can be used with a larger data set simulating long term use:

```bash
npm run mock-server:start:large
```

DB file for 'large' mode is automatically generated after NPM package installation, but it
can be re-generated using

```bash
npm run mock-server:gen-large-db
```

Expense category metadata includes icon URLS in data-URL encoded format, but it supports
any valid path. App assumes these icons to be black.


## Production

Build the application for production:

```bash
npm run build
```

Locally preview production build:

```bash
npm run preview
```
## App overview

App has a single view with various cards. It's built with responsive grid and switches
card arrangement depending on screen size.

### Header

Header contains transaction filter with 3 modes: Month, Year and Custom.

User can switch between modes with buttons + adjacent Month and Year can be selected
using arrow buttons. Custom interval can be selected with date picker.

### Chart area

Chart area hosts 2 views for analytics: category donut chart and net history line chart, user
can switch between them with arrow buttons.

Category chart shows several top used categories (configurable) and groups the rest under "Other" category.
These categories are shown below chart to allow quick filtering.
Expense totals are shows in chart center.

### Totals view

Totals view provides quick overview of total expenses, income and net money.
It's global and is not affected by category filter in chart area.

### Transactions view

Transactions view shows filtered transactions in a list with virtual scroll support, so
it can handle a lot of items w/o UX issues.

User may choose how to show transactions: grouped by date or as a flat list sorted by
absolute transaction amount.

Here user can also add a new transaction or edit any existing one.

### Data limits

Despite virtual scroll presence, there's a configurable limit
for number of transactions: error will be shown to user if there are too many. This is
done to avoid potential performance issues from scripting, but this limit is by default
quite large and sensible app use won't result in exceeding this limit.

There is no limit for categories because too many might overwhelm user and such usage is undesired.

### Caching

App caches category metadata query and never re-runs it.

Transaction queries are cached using Least Recently Used cache, number of entries is
configurable (defaults to 5).
Modifying transaction list in any way will invalidate queries with intersecting intervals,
thus executing them again.

### SSR

App is built using nuxt and supports Server-Side Rendering.
Cookies are used to store persistent user settings like filter setup, these cookies are used
on server to apply state and run initial transactions query before sending resources to client.

### Lazy loading

Most of the app is loaded immediately because it's always visible.
Transaction modification dialog is loaded on demand.

### Dark mode

App automatically detects dark mode and switches styles accordingly.

### Localization

All predefined text in the app uses i18n for translations.
Default language is English; Russian is accessible at `/ru` URL (e.g. http://localhost:3001/ru).

This doesn't affect fetched data, real API should serve category metadata with different translations. 'Accept-Language' header is sent by app to allow that.