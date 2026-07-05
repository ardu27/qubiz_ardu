# What I Would Build Next

If I had two more weeks to work on this project, here is exactly how I would prioritize my time and what I would add to the app.

## Priority 1 — Features that would fundamentally improve the experience

**An Admin / HR Dashboard**
Right now, the whole system relies on me seeding the MySQL databases with dummy data (using EF Core `DbSeeder` classes) so that we have users, tasks, and departments to play with. For the app to be actually usable in the real world, HR needs an interface. I would build a dedicated admin section where HR can manually create a new employee profile, automatically generate an onboarding checklist for them, and assign them a buddy. This would require some heavy lifting on both the React frontend and adding new endpoints to the Employees and Onboarding microservices.

## Priority 2 — Features that would add significant value

**Real-Time Notifications (SignalR)**
Right now, you just click around to see what's happening. It would be a huge value-add to have real-time updates. For example, if your assigned buddy books a desk on Wednesday, it would be awesome to get a live notification bubble right there in the app telling you they'll be in the office. I've never used SignalR before, so it would be a great thing to learn.

**Real Slack API Integration**
I built a really cool simulated Slack window when you click "Join" on a channel, but it's just a frontend mock. I would love to spend a few days figuring out OAuth and actually connecting the backend to a real Slack workspace so it genuinely adds you to channels and sends actual messages. 

## Priority 3 — Nice-to-have improvements and why they matter

**Docker & Containerization**
The `start-backend.bat` script works perfectly fine for running the app on my local machine, but it opens four different command prompt windows at once. Setting up a proper `docker-compose.yml` to orchestrate the API Gateway, the three .NET microservices, and the three separate MySQL databases would make the project much easier to share on GitHub and look a lot more professional.


