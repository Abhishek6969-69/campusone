#!/usr/bin/env node

// Test script for NextAuth signup functionality
async function testSignup() {
  const testUser = {
    name: "John Doe",
    email: "john.doe@test.com",
    password: "testpassword123",
    role: "STUDENT",
    collegeId: "6"
  };

  try {
    console.log("🧪 Testing signup functionality...");
    console.log("📝 Test user data:", JSON.stringify(testUser, null, 2));

    const response = await fetch("http://localhost:3000/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testUser),
    });

    const result = await response.json();
    
    console.log("\n📊 Response Status:", response.status);
    console.log("📊 Response Data:", JSON.stringify(result, null, 2));

    if (response.ok) {
      console.log("\n✅ Signup test PASSED! User created successfully.");
      
      // Test duplicate signup
      console.log("\n🧪 Testing duplicate signup prevention...");
      const duplicateResponse = await fetch("http://localhost:3000/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testUser),
      });
      
      const duplicateResult = await duplicateResponse.json();
      console.log("📊 Duplicate Response Status:", duplicateResponse.status);
      console.log("📊 Duplicate Response Data:", JSON.stringify(duplicateResult, null, 2));
      
      if (duplicateResponse.status === 400 && duplicateResult.error === "User already exists") {
        console.log("✅ Duplicate prevention test PASSED!");
      } else {
        console.log("❌ Duplicate prevention test FAILED!");
      }
      
    } else {
      console.log("\n❌ Signup test FAILED!");
    }

  } catch (error) {
    console.error("\n💥 Test error:", error.message);
    
    if (error.cause?.code === 'ECONNREFUSED') {
      console.log("⚠️  Make sure the development server is running on http://localhost:3000");
    }
  }
}

// Run the test
testSignup().catch(console.error);
