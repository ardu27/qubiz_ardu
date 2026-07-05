# Decisions

This document outlines the main product, technical, and design decisions I made while building Meridian Onboarding.

## Product decisions

### Which features did you include?
I built the application around four core pillars:
1. A dashboard that aggregates everything a new hire needs on day one.
2. A gamified checklist divided into phases (Day 1, Week 1, Month 1).
3. A resource hub that includes simulated integration with company Slack channels.
4. An interactive team calendar that allows employees to book desks for their hybrid work days.

### How did you prioritize them?
I prioritized features based on what reduces anxiety for a new employee. Knowing exactly what tasks to complete (Checklist) and knowing who to ask for help (Buddy matching) were the highest priorities. The desk booking system was added next to help the new hire figure out when their buddy or team members would actually be in the office.

### Which features did you intentionally leave out of scope?
I completely left out the HR administrative side. There is no admin panel to create users, assign tasks, or manage departments. I assumed that in a real scenario, this data is already populated by the HR department. I also skipped complex authentication flows like password resets and email verification to focus purely on the frontend UX and the microservices architecture.

## Technical decisions

### Why did you choose this database structure?
I chose a database-per-service pattern using MySQL. The system has three separate databases (`meridian_employees`, `meridian_onboarding`, and `meridian_booking`). I did this to ensure the microservices are genuinely decoupled. It means I have to use an API Gateway to aggregate data (like pulling employee data and onboarding data together for the dashboard), but it prevents the services from becoming a monolith.

### Why did you choose these libraries/frameworks?
* **Backend:** I used .NET 9 and ASP.NET Core because it is robust and excellent for building APIs. I used YARP for the API Gateway because it integrates seamlessly with .NET and easily routes frontend requests to the correct internal ports.
* **Frontend:** I used React with Vite and Tailwind CSS. I chose Tailwind specifically because I wanted to build a custom "editorial" aesthetic. Standard component libraries (like Material UI or Bootstrap) would have made the app look too much like a generic corporate tool.

### If you had more time, what would you build differently?
Honestly, if I had more time, I would probably try to containerize everything with Docker. Right now, I'm just using a batch script that opens four different command prompts to start the services. Docker would have made starting the app a lot cleaner, but I didn't want to get stuck on DevOps stuff. I'd also maybe try to integrate something completely new that I haven't really used in my college projects before, like hooking up a real Slack bot via their API instead of just mocking the chat interface in React.

## UX decisions

### Why did you choose this user flow?
I kept it as flat and simple as possible. You log in, you see your dashboard, and you have a sidebar for the main sections. I didn't want to bury things in deep menus. The logic is that a new hire on their first day is already stressed enough, so giving them a super clean flow prevents them from getting lost or frustrated.

### Did you test it with anyone?
I just showed it to a classmate to see if the interface was clear enough and if they could figure out what to click without me explaining it first.

### What changed after receiving feedback?
The main thing was the design. At first, the app looked like your average, slightly boring university project dashboard—white background, rounded corners, standard cards. My colleague said it felt a bit generic. So, I completely changed the vibe to this cleaner, "editorial" look because I wanted it to feel premium. Also, initially, the team calendar was just a static grid. Feedback made me realize it would be way cooler if you could actually interact with it, which is why I ended up building the whole Booking microservice so people could actually reserve desks.
