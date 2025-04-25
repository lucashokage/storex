// Mock seed function that doesn't rely on SQLite
export async function seedDatabase() {
  try {
    console.log("Mock database seed function called")
    return true
  } catch (error) {
    console.error("Error with mock database seed:", error)
    return false
  }
}
