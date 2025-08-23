# Sol-AI Planner: Technical Specification Document

## Executive Summary
Sol-AI Planner is an intelligent SaaS platform that combines AI-powered soiling prediction with TSP-optimized drone cleaning routes for solar farm operations and maintenance.

## System Architecture

### 1. Frontend Layer
- **Framework**: React 18 with TypeScript
- **Map Engine**: Mapbox GL JS with custom overlays
- **UI Components**: Material-UI with custom solar theme
- **State Management**: Redux Toolkit for complex state
- **Real-time Updates**: WebSocket integration

### 2. Backend Services

#### API Gateway (FastAPI)
```python
# Main API endpoints
POST /api/farms - Create new solar farm
GET /api/farms/{farm_id}/status - Get farm status
POST /api/farms/{farm_id}/optimize - Generate cleaning routes
GET /api/weather/{location} - Weather data integration
```

#### Soiling Prediction Service
```python
# ML Model Pipeline
class SoilingPredictor:
    def __init__(self):
        self.lstm_model = load_model('lstm_weather.h5')
        self.xgb_model = load_model('xgb_soiling.pkl')
    
    def predict_soiling(self, weather_data, panel_data):
        weather_features = self.lstm_model.predict(weather_data)
        soiling_prediction = self.xgb_model.predict(weather_features)
        return soiling_prediction
```

#### Path Optimization Engine
```python
# TSP Solver Implementation
class TSPOptimizer:
    def optimize_cleaning_route(self, dirty_panels, drone_specs):
        # Modified Christofides Algorithm
        graph = self.create_distance_matrix(dirty_panels)
        route = self.christofides_solve(graph)
        optimized_route = self.two_opt_improvement(route)
        return self.calculate_efficiency_metrics(optimized_route)
```

### 3. Data Layer
- **Primary Database**: PostgreSQL with PostGIS extension
- **Cache Layer**: Redis for real-time data
- **File Storage**: AWS S3 for drone images and reports
- **Time Series**: InfluxDB for sensor data

### 4. ML/AI Components

#### Weather Forecasting Model
- **Architecture**: LSTM with attention mechanism
- **Input Features**: Temperature, humidity, wind speed, PM2.5, precipitation
- **Output**: 7-day soiling accumulation forecast
- **Accuracy**: 85% validated against historical data

#### Soiling Detection Model  
- **Architecture**: XGBoost ensemble
- **Features**: Weather data, panel age, location, historical cleaning
- **Output**: Soiling severity score (0-100)
- **Training Data**: 50K+ panel-hour observations

#### Route Optimization Algorithm
- **Base Algorithm**: Modified Christofides for TSP
- **Optimization**: 2-opt local search improvement
- **Constraints**: Battery life, weather conditions, maintenance windows
- **Performance**: 50K+ panels solved in <30 seconds

## API Documentation

### Core Endpoints

#### Farm Management
```
GET /api/farms
Response: List of all solar farms

POST /api/farms
Body: {
  "name": "Farm Name",
  "location": {"lat": 12.34, "lng": 56.78},
  "panels": 5000,
  "layout": "grid|string"
}
```

#### Soiling Prediction
```
GET /api/farms/{id}/soiling-forecast
Response: {
  "forecast": [
    {"date": "2025-08-24", "soiling_score": 0.23},
    {"date": "2025-08-25", "soiling_score": 0.31}
  ],
  "recommended_cleaning": "2025-08-26"
}
```

#### Route Optimization
```
POST /api/farms/{id}/optimize-route
Body: {
  "dirty_panels": [101, 205, 312],
  "drone_specs": {"battery_life": 45, "speed": 15},
  "constraints": {"max_time": 120}
}
Response: {
  "route": [101, 312, 205],
  "estimated_time": 87,
  "battery_usage": 78,
  "efficiency_gain": 34
}
```

## Database Schema

### Farms Table
```sql
CREATE TABLE farms (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location POINT NOT NULL,
    panel_count INTEGER,
    installation_date DATE,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Panels Table
```sql
CREATE TABLE panels (
    id SERIAL PRIMARY KEY,
    farm_id INTEGER REFERENCES farms(id),
    position POINT NOT NULL,
    panel_type VARCHAR(100),
    installation_date DATE,
    last_cleaned TIMESTAMP
);
```

### Soiling History
```sql
CREATE TABLE soiling_history (
    id SERIAL PRIMARY KEY,
    panel_id INTEGER REFERENCES panels(id),
    soiling_score FLOAT,
    measured_at TIMESTAMP,
    weather_conditions JSONB
);
```

## Security Specifications

### Authentication & Authorization
- **Method**: OAuth 2.0 with JWT tokens
- **Token Expiry**: 24 hours for access, 30 days for refresh
- **Role-based Access**: Admin, Operator, Viewer levels

### API Security
- **Rate Limiting**: 1000 requests/hour per API key
- **Input Validation**: Comprehensive sanitization and validation
- **HTTPS Only**: TLS 1.3 encryption for all communications

### Data Protection
- **Encryption**: AES-256 for sensitive data at rest
- **PII Handling**: Minimal collection, opt-in consent
- **Audit Logging**: All API calls and data access logged

## Performance Specifications

### Response Time Targets
- **Dashboard Load**: <2 seconds
- **Route Optimization**: <30 seconds for 50K panels
- **Real-time Updates**: <500ms WebSocket latency

### Scalability
- **Concurrent Users**: 1000+ per instance
- **Database**: Horizontally scalable with read replicas
- **Auto-scaling**: Kubernetes HPA based on CPU/memory

## Deployment Architecture

### Development Environment
```yaml
# docker-compose.yml
version: '3.8'
services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
  
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/solai
  
  database:
    image: postgis/postgis:13-master
    environment:
      POSTGRES_DB: solai
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
```

### Production Deployment
- **Container Orchestration**: Kubernetes
- **Service Mesh**: Istio for traffic management
- **Monitoring**: Prometheus + Grafana
- **Logging**: ELK Stack (Elasticsearch, Logstash, Kibana)

## Testing Strategy

### Unit Testing
- **Coverage Target**: 90%+
- **Framework**: Jest for frontend, pytest for backend
- **Test Data**: Synthetic datasets for reproducible tests

### Integration Testing
- **API Testing**: Automated testing of all endpoints
- **ML Model Testing**: Validation against holdout datasets
- **Performance Testing**: Load testing with k6

### End-to-End Testing
- **User Flows**: Automated testing of critical user journeys
- **Cross-browser**: Chrome, Firefox, Safari compatibility
- **Mobile**: Responsive design testing on multiple devices

## Monitoring & Analytics

### Application Monitoring
- **Uptime**: 99.9% SLA target
- **Error Tracking**: Sentry for error monitoring
- **Performance**: New Relic for APM

### Business Metrics
- **User Engagement**: Active users, session duration
- **Feature Usage**: Most/least used features
- **Performance Impact**: Efficiency gains per customer

### ML Model Monitoring
- **Model Drift**: Automated detection of prediction degradation
- **Data Quality**: Monitoring input data for anomalies
- **Prediction Accuracy**: Continuous validation against actual outcomes

## Compliance & Regulations

### Data Protection
- **GDPR**: Full compliance for EU customers
- **CCPA**: California privacy law compliance
- **SOC 2**: Security audit and certification

### Industry Standards
- **ISO 27001**: Information security management
- **IEEE Standards**: Solar industry best practices
- **Drone Regulations**: Compliance with FAA/DGCA guidelines

## Support & Documentation

### User Documentation
- **Getting Started Guide**: Step-by-step setup
- **Feature Documentation**: Comprehensive user manual
- **Video Tutorials**: Screen recordings for complex features

### Developer Resources
- **API Documentation**: OpenAPI/Swagger specs
- **SDK Libraries**: Python, JavaScript client libraries
- **Integration Guides**: Third-party system integration

### Support Channels
- **Knowledge Base**: Searchable FAQ and troubleshooting
- **Email Support**: Response within 24 hours
- **Live Chat**: Business hours support for premium customers

---

*This technical specification serves as the foundation for Sol-AI Planner development and implementation.*