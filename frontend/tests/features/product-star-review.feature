Feature: Product star reviews
  As a supply chain planner
  I want to rate products with stars directly on the product page
  So that I can capture my impression of an item while browsing the catalog

  Scenario: Rate a product with stars
    Given I am viewing the product catalog
    When I select the fourth star for "SmartFeeder One"
    Then the rating for "SmartFeeder One" shows "4 of 5"
    And the first four stars for "SmartFeeder One" are highlighted

  Scenario: Change a rating for a product
    Given I am viewing the product catalog
    And I have rated "SmartFeeder One" with four stars
    When I select the second star for "SmartFeeder One"
    Then the rating for "SmartFeeder One" shows "2 of 5"

  Scenario: Products start without a rating
    Given I am viewing the product catalog
    Then every product prompts me to "Rate it"
