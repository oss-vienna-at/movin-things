import { newE2EPage } from "@stencil/core/testing";
import { describe, it, expect } from "jasmine";

describe("movin-things", () => {
  it("renders", async () => {
    const page = await newE2EPage({ url: "/" });

    const element = await page.find("movin-things");
    expect(element).toHaveClass("hydrated");
  });

  it("renders the title", async () => {
    const page = await newE2EPage({ url: "/" });

    const element = await page.find("movin-things >>> h1");
    expect(element.textContent).toEqual("Movin Things parameters");
  });
});
