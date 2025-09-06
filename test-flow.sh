#!/bin/bash

echo "🧪 Testing Campus OS User Flow"
echo "================================"

# Test 1: Create a new user
echo "📝 1. Creating new user..."
SIGNUP_RESPONSE=$(curl -s -X POST http://localhost:3000/api/signup \
  -H "Content-Type: application/json" \
  -d '{"name": "Flow Test User", "email": "flowtest@test.edu", "password": "password123", "role": "STUDENT", "collegeId": "02333a71-973e-4a12-9d10-fda7949ff58c"}')

echo "Signup Response: $SIGNUP_RESPONSE"

if echo "$SIGNUP_RESPONSE" | grep -q "User created successfully"; then
    echo "✅ User created successfully"
else
    echo "❌ User creation failed"
    exit 1
fi

echo ""
echo "🔐 2. Testing profile update without authentication..."
UPDATE_RESPONSE=$(curl -s -X POST http://localhost:3000/api/update-profile \
  -H "Content-Type: application/json" \
  -d '{"rollNo": "2023001", "phone": "+91-9876543210"}' \
  -w "\nHTTP_STATUS:%{http_code}")

echo "Update Response: $UPDATE_RESPONSE"

if echo "$UPDATE_RESPONSE" | grep -q "HTTP_STATUS:401"; then
    echo "✅ Authentication protection working"
else
    echo "❌ Authentication protection failed"
fi

echo ""
echo "🌐 3. Testing page accessibility..."

# Test signup page
if curl -s http://localhost:3000/signup | grep -q "CAMPUS OS"; then
    echo "✅ Signup page accessible"
else
    echo "❌ Signup page issue"
fi

# Test profile setup page (should redirect to signup when not authenticated)
PROFILE_RESPONSE=$(curl -s -L http://localhost:3000/setup-profile)
if echo "$PROFILE_RESPONSE" | grep -q "CAMPUS OS"; then
    echo "✅ Profile setup page accessible (redirected to signup as expected)"
else
    echo "❌ Profile setup page issue"
fi

echo ""
echo "✅ Flow test completed!"
