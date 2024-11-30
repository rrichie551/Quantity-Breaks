// @ts-check
import { DiscountApplicationStrategy } from "../generated/api";

// Use JSDoc annotations for type safety
/**
 * @typedef {import("../generated/api").RunInput} RunInput
 * @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
 * @typedef {import("../generated/api").Target} Target
 * @typedef {import("../generated/api").ProductVariant} ProductVariant
 */

/**
 * @type {FunctionRunResult}
 */
const EMPTY_DISCOUNT = {
  discountApplicationStrategy: DiscountApplicationStrategy.First,
  discounts: [],
};
/**
 * @param {RunInput} input
 * @returns {FunctionRunResult}
 */
export function run(input) {
  const targetsi = input.cart.lines.filter((line) => !!line.comboDiscountType?.value === true);
  const targets = input.cart.lines
    // Only include cart lines with a quantity of two or more
    .filter((line) => !!line.comboDiscountType?.value === true)
    .map((line) => {
      return /** @type {Target} */ ({
        // Use the cart line ID to create a discount target
        cartLine: {
          id: line.id,
        },
      });
    });
  if (!targets.length) {
    // You can use STDERR for debug logs in your function
    console.error("No cart lines qualify for volume discount.");
    return EMPTY_DISCOUNT;
  }

  return {
    discounts: [
      {
        // Apply the discount to the collected targets
        targets,
        // Define a percentage-based discount
        value: {
          fixedAmount: {
            amount: targetsi[0].comboDiscountValue?.value,
            appliesToEachItem: true
          },
        },
      },
    ],
    discountApplicationStrategy: DiscountApplicationStrategy.First,
  };
}
