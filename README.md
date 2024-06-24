# CustomerLoyaltyProgram

1. Design Architecture Diagram
Architecture Overview


![ZLHTJuCm57tdLpG-QQBPFp1kytkWw3HxMFPm1rVM37gNjgXe_E-sR2g5iiW3eVVZdDlJKywK1gdB8W-23IHho90THC05crPAOt70FWDcdda88kKYOx6fM6n3pmebYoMzy7mNgb-_CCDIhr1ede3c90PsIP9_rAiVt1hetgQEsUtiQGlpvGEBRzWLQ7o3okczoxXu7qn8PFszOoeACZj2-SeJL4x_k5IQ2hEHQRdPaDIBlrGCLM7cRqH2gY3](https://github.com/Anandamayee/CustomerLoyaltyProgram/assets/25376748/ecc67d97-3b0f-4c5a-ae1d-130743cb96e5)


2. System Flow
        User Authentication & Authorization:
        Users access the landing page and log in via OAuth.
        JWT tokens are issued upon successful authentication.
API Gateway:
        API Gateway (Nginx/Kong) routes requests to appropriate microservices.
        It ensures secure and controlled access to the microservices.
Load Balancer:
        Distributes incoming traffic across multiple instances of microservices to ensure high availability and reliability.
Microservices:
        Each microservice (Grocery, Medicine, Flight, Loyalty Store) has its own database and handles its specific functionality.
        Services communicate with each other via the message broker (RabbitMQ).
Common Services:
        Handles cross-cutting concerns such as payment processing, loyalty wallet management, and customer support.
Data Management:
        Each microservice manages its own data using MongoDB.
        Caching with Redis/Memcached is used to improve performance.
Deployment & Monitoring:
        Services are containerized using Docker and orchestrated using Kubernetes.
        System health and performance are monitored using Prometheus.
        Logs are collected and analyzed using the ELK stack (Elasticsearch, Logstash, Kibana).
   

   ![imagesss](https://github.com/Anandamayee/CustomerLoyaltyProgram/assets/25376748/25a930b8-500b-48f1-9193-b10f447aa6ba)


    


4. Tech Stack Recommendations
        Frontend:
                React: For building responsive user interfaces.
        Backend:
                NestJS: For building scalable and maintainable microservices.
        MongoDB: For each microservice's database management.
        Common Services:
                Redis/Memcached: For caching.
                RabbitMQ: For message brokering.
                Prometheus: For monitoring.
                ELK Stack (Elasticsearch, Logstash, Kibana): For logging and analyzing logs.
        Deployment & Orchestration:
                Docker: For containerizing applications.
                Kubernetes: For orchestrating containerized applications.
                Nginx/Kong: For API gateway.
        Security:
                OAuth: For user authentication.
                JWT: For secure token-based authorization.
        Additional Tools:
                HAProxy: For load balancing.





