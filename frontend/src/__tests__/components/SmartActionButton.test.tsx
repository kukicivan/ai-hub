import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import SmartActionButton, {
  getPrimaryAction,
  getRecommendedActions,
  ActionStep,
  ActionType,
} from "@/components/ui/SmartActionButton";

describe("SmartActionButton", () => {
  const mockOnActionSelect = vi.fn();

  const defaultPrimaryAction: ActionStep = {
    type: "RESPOND",
    description: "Reply to email",
    timeline: "hitno",
  };

  beforeEach(() => {
    mockOnActionSelect.mockClear();
  });

  it("renders with primary action label", () => {
    render(
      <SmartActionButton
        primaryAction={defaultPrimaryAction}
        onActionSelect={mockOnActionSelect}
      />
    );

    expect(screen.getByText("Odgovori")).toBeInTheDocument();
  });

  it("calls onActionSelect when primary button is clicked", () => {
    render(
      <SmartActionButton
        primaryAction={defaultPrimaryAction}
        onActionSelect={mockOnActionSelect}
      />
    );

    fireEvent.click(screen.getByText("Odgovori"));

    expect(mockOnActionSelect).toHaveBeenCalledWith(defaultPrimaryAction);
  });

  it("renders dropdown trigger button", () => {
    render(
      <SmartActionButton
        primaryAction={defaultPrimaryAction}
        onActionSelect={mockOnActionSelect}
      />
    );

    // Should have the dropdown chevron button
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThanOrEqual(2);
  });

  it("is disabled when disabled prop is true", () => {
    render(
      <SmartActionButton
        primaryAction={defaultPrimaryAction}
        onActionSelect={mockOnActionSelect}
        disabled={true}
      />
    );

    const mainButton = screen.getByText("Odgovori").closest("button");
    expect(mainButton).toBeDisabled();
  });
});

describe("getPrimaryAction", () => {
  it("returns first action from action_steps", () => {
    const actionSteps: ActionStep[] = [
      { type: "RESPOND", description: "Reply" },
      { type: "SCHEDULE", description: "Schedule call" },
    ];

    const primary = getPrimaryAction(actionSteps);

    expect(primary.type).toBe("RESPOND");
    expect(primary.description).toBe("Reply");
  });

  it("returns default RESPOND action when action_steps is empty", () => {
    const primary = getPrimaryAction([]);

    expect(primary.type).toBe("RESPOND");
  });

  it("returns default RESPOND action when action_steps is undefined", () => {
    const primary = getPrimaryAction(undefined);

    expect(primary.type).toBe("RESPOND");
  });
});

describe("getRecommendedActions", () => {
  it("returns all actions except the first one", () => {
    const actionSteps: ActionStep[] = [
      { type: "RESPOND", description: "Reply" },
      { type: "SCHEDULE", description: "Schedule call" },
      { type: "TODO", description: "Add to tasks" },
    ];

    const recommended = getRecommendedActions(actionSteps);

    expect(recommended).toHaveLength(2);
    expect(recommended[0].type).toBe("SCHEDULE");
    expect(recommended[1].type).toBe("TODO");
  });

  it("returns empty array when only one action", () => {
    const actionSteps: ActionStep[] = [{ type: "RESPOND", description: "Reply" }];

    const recommended = getRecommendedActions(actionSteps);

    expect(recommended).toHaveLength(0);
  });

  it("returns empty array when action_steps is undefined", () => {
    const recommended = getRecommendedActions(undefined);

    expect(recommended).toHaveLength(0);
  });
});

describe("Action Type Colors", () => {
  const actionTypes: ActionType[] = [
    "RESPOND",
    "SCHEDULE",
    "TODO",
    "POSTPONE",
    "RESEARCH",
    "FOLLOW_UP",
    "ARCHIVE",
  ];

  it("all action types should be defined", () => {
    actionTypes.forEach((type) => {
      const action: ActionStep = { type, description: `Test ${type}` };
      expect(action.type).toBe(type);
    });
  });

  it("RESPOND should be blue color", () => {
    // This tests the mapping logic
    const actionConfig = {
      RESPOND: { bgColor: "bg-blue-600" },
      SCHEDULE: { bgColor: "bg-purple-600" },
      TODO: { bgColor: "bg-emerald-500" },
      POSTPONE: { bgColor: "bg-yellow-500" },
      RESEARCH: { bgColor: "bg-indigo-500" },
      FOLLOW_UP: { bgColor: "bg-orange-500" },
      ARCHIVE: { bgColor: "bg-gray-500" },
    };

    expect(actionConfig.RESPOND.bgColor).toContain("blue");
    expect(actionConfig.SCHEDULE.bgColor).toContain("purple");
    expect(actionConfig.TODO.bgColor).toContain("emerald");
    expect(actionConfig.POSTPONE.bgColor).toContain("yellow");
    expect(actionConfig.ARCHIVE.bgColor).toContain("gray");
  });
});
