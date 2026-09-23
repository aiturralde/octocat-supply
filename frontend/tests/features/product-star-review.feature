Feature: Product star reviews
  As a supply chain planner
  I want to rate products with stars directly on the product page
  So that I can capture my impression of an item while browsing the catalog

  Scenario: Rate a product with stars
    Given I am viewing the product catalog
    When I select the fourth star for "SmartFeeder One"
    Then the rating for "SmartFeeder One" shows "4 of 5"
    And the fourth star for "SmartFeeder One" is selected and highlighted in red

  Scenario: Change a rating for a product
    Given I am viewing the product catalog
    And I have rated "SmartFeeder One" with four stars
    When I select the second star for "SmartFeeder One"
    Then the rating for "SmartFeeder One" shows "2 of 5"

  Scenario: Products start without a rating
    Given I am viewing the product catalog
    Then every product prompts me to "Rate it"

  Scenario: Rate a product with the keyboard
    Given I am viewing the product catalog
    When I focus the star review for "SmartFeeder One" and press the right arrow key twice
    Then the rating for "SmartFeeder One" shows "2 of 5"
    And the second star for "SmartFeeder One" keeps keyboard focus
