// Mock in-memory database for serverless environment
class MockDatabase {
  private data: Record<string, any[]> = {
    products: [],
    product_colors: [],
    cart_items: [],
    users: [],
    activities: [],
  }

  select() {
    return {
      from: (table: any) => {
        return {
          where: () => this.data[table.name] || [],
          limit: () => this.data[table.name]?.[0] || null,
          execute: () => this.data[table.name] || [],
        }
      },
      execute: () => [],
    }
  }

  insert(table: any) {
    return {
      values: (data: any) => {
        if (!this.data[table.name]) {
          this.data[table.name] = []
        }
        const id = this.data[table.name].length + 1
        const newItem = { ...data, id }
        this.data[table.name].push(newItem)
        return {
          returning: () => [{ id }],
        }
      },
    }
  }

  update(table: any) {
    return {
      set: (data: any) => {
        return {
          where: (condition: any) => {
            // Mock implementation
            return { execute: () => ({ rowsAffected: 1 }) }
          },
        }
      },
    }
  }

  delete(table: any) {
    return {
      where: () => {
        return { execute: () => ({ rowsAffected: 1 }) }
      },
    }
  }
}

// Export a mock database interface that mimics Drizzle's API
export const db = {
  select: () => ({
    from: (table: any) => {
      return {
        where: () => [],
        limit: () => null,
      }
    },
  }),
  insert: (table: any) => ({
    values: (data: any) => ({
      returning: () => [{ id: 1 }],
    }),
  }),
  update: (table: any) => ({
    set: (data: any) => ({
      where: () => ({ execute: () => ({ rowsAffected: 1 }) }),
    }),
  }),
  delete: (table: any) => ({
    where: () => ({ execute: () => ({ rowsAffected: 1 }) }),
  }),
}

// Function to initialize the database (no-op in serverless)
export const initDb = () => {
  console.log("Mock database initialized")
}

// Initialize the mock database
initDb()
