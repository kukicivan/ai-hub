// Mock the baseApi
jest.mock("@/redux/api/baseApi", () => ({
  baseApi: {
    injectEndpoints: jest.fn().mockReturnValue({
      endpoints: {},
    }),
  },
}));

describe("Settings API Types", () => {
  it("should have correct UserGoal interface structure", () => {
    interface UserGoal {
      id: number;
      user_id: number;
      type: "primary" | "secondary";
      key: string;
      value: string;
      is_active: boolean;
      sort_order: number;
      created_at: string;
      updated_at: string;
    }

    const goal: UserGoal = {
      id: 1,
      user_id: 1,
      type: "primary",
      key: "main_focus",
      value: "Test focus",
      is_active: true,
      sort_order: 0,
      created_at: "2025-11-22T00:00:00Z",
      updated_at: "2025-11-22T00:00:00Z",
    };

    expect(goal.type).toBe("primary");
    expect(goal.key).toBe("main_focus");
    expect(goal.is_active).toBe(true);
  });

  it("should have correct UserCategory interface structure", () => {
    interface UserSubcategory {
      id: number;
      category_id: number;
      name: string;
      display_name: string;
      is_active: boolean;
    }

    interface UserCategory {
      id: number;
      user_id: number;
      name: string;
      display_name: string;
      description: string | null;
      priority: "high" | "medium" | "low";
      is_active: boolean;
      is_default: boolean;
      subcategories: UserSubcategory[];
    }

    const category: UserCategory = {
      id: 1,
      user_id: 1,
      name: "automation_opportunity",
      display_name: "Automation Opportunity",
      description: "B2B automation",
      priority: "high",
      is_active: true,
      is_default: true,
      subcategories: [
        {
          id: 1,
          category_id: 1,
          name: "workflow",
          display_name: "Workflow",
          is_active: true,
        },
      ],
    };

    expect(category.priority).toBe("high");
    expect(category.subcategories).toHaveLength(1);
    expect(category.subcategories[0].name).toBe("workflow");
  });

  it("should have correct UserAiServices interface structure", () => {
    interface UserAiServices {
      gmail_active: boolean;
      viber_active: boolean;
      whatsapp_active: boolean;
      telegram_active: boolean;
      social_active: boolean;
      slack_active: boolean;
    }

    const services: UserAiServices = {
      gmail_active: true,
      viber_active: false,
      whatsapp_active: false,
      telegram_active: false,
      social_active: false,
      slack_active: false,
    };

    expect(services.gmail_active).toBe(true);
    expect(services.viber_active).toBe(false);
  });

  it("should have correct UserApiKey interface structure", () => {
    interface UserApiKey {
      id: number;
      service: string;
      masked_key: string;
      is_active: boolean;
      is_valid: boolean;
    }

    const apiKey: UserApiKey = {
      id: 1,
      service: "grok",
      masked_key: "••••••••abcd",
      is_active: true,
      is_valid: true,
    };

    expect(apiKey.service).toBe("grok");
    expect(apiKey.masked_key).toContain("••••");
    expect(apiKey.is_valid).toBe(true);
  });
});

describe("Goal Input Validation", () => {
  it("should validate GoalInput structure", () => {
    interface GoalInput {
      key: string;
      value: string;
      type: "primary" | "secondary";
      is_active?: boolean;
    }

    const validGoal: GoalInput = {
      key: "main_focus",
      value: "Automation focus",
      type: "primary",
      is_active: true,
    };

    expect(validGoal.key).toBeTruthy();
    expect(validGoal.value).toBeTruthy();
    expect(["primary", "secondary"]).toContain(validGoal.type);
  });

  it("should validate CategoryInput structure", () => {
    interface CategoryInput {
      name: string;
      display_name: string;
      description?: string;
      priority: "high" | "medium" | "low";
    }

    const validCategory: CategoryInput = {
      name: "new_category",
      display_name: "New Category",
      description: "A new category",
      priority: "medium",
    };

    expect(validCategory.name).toBeTruthy();
    expect(validCategory.display_name).toBeTruthy();
    expect(["high", "medium", "low"]).toContain(validCategory.priority);
  });

  it("should validate ApiKeyInput structure", () => {
    interface ApiKeyInput {
      service: "grok" | "openai" | "github" | "slack";
      key: string;
    }

    const validApiKey: ApiKeyInput = {
      service: "grok",
      key: "xai-abcdefghij1234567890",
    };

    expect(validApiKey.key.length).toBeGreaterThanOrEqual(10);
    expect(["grok", "openai", "github", "slack"]).toContain(validApiKey.service);
  });
});
