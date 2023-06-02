IMPORTANT! THIS PROJECT IS VERY COMPLEX BUT THE CODE AND STRUCTURING IS VERY BAD. MORE OF WHICH BELOW.
Please DO test the live application as it contains a lot of logic and is surely much more complex than a shopping cart.

I wanted to inform you that there aren't many commits in this repository. During the time I worked on these projects, I was unaware of the significance of maintaining a comprehensive git history. While I used git to add commits and revert changes locally, I did not prioritize pushing them to the remote repository. As a result, the commit history may appear sparse or incomplete.

[https://fifipoly.web.app/]

react version in development - [https://github.com/faforus/reactpoly]

JavaScript Portfolio

This is my original implementation of the classic Monopoly board game. I embarked on this project when I was only one month into learning JavaScript. At the time, I was not familiar with some best practices, which have resulted in a somewhat disorganized codebase. Although I have since become aware of these issues, I have not had the opportunity to address them as I shifted my focus to more practical React project. A list of the identified issues can be found at the bottom of this page.

The entire game logic implementation was designed and authored by me. I did not consult any resources on how to create such a game or preplan any aspects. Instead, I developed the game incrementally, applying the knowledge I acquired at each stage. As my understanding grew, so did the complexity and sophistication of my implementation.

The code primarily features operations on objects and arrays, as well as basic DOM manipulation through rendering the game state.

The game accommodates up to four players who take turns on the same device. Players can move by clicking the dice or pressing the "R" button. Almost every game space has an associated action.

Streets:

If unowned and affordable, players can purchase the street.

If owned by another player, the current player must pay a penalty.

If owned by the current player, no action occurs.

Community Chest/Chance:

Essentially identical spaces.

Upon landing on one, a random action is triggered. This action is then removed from the available actions array. Once all actions have been executed, they are reset and made available again. This simulates the process of drawing and discarding cards from a deck.

Go to Jail:

Player loses turns, which are automatically skipped.

While in jail, players do not collect any income from other players who land on their properties.

Start or Crossing the Start:

Players receive a monetary reward.

Tax Office:

Players lose a percentage of their wealth.

Interface on the right:

Current player can upgrade their properties and increase penalties if they own a complete set.

Current player can target other players' properties to buy them for money or trade them for their own properties.

Current player can mortgage their property, which suspends penalties for landing on them.

Bankruptcy:

Players who lose all their money can choose to forfeit the game or receive funds to pay off their debts and continue playing by either selling houses or mortgaging properties.

Feedback:

All actions are logged, and the user interface is constantly updated to display the current state of the game. This includes property rank, current penalties, player properties, wealth, and turns spent in jail.
Identified issues with the application:

Known bugs:

I have extensively tested this application through various scenarios, simulating players landing on different fields with diverse monetary values. I have also examined the processes of mortgaging, upgrading, and selling/trading properties. Additionally, I have explored and implemented multiple solutions for players on the verge of bankruptcy, focusing on the distribution of money and debt resolution. As a result, I am confident that the game is largely free of logical errors, with two notable exceptions:

When the 'Start Game' button is pressed and subsequently canceled, the ability to initiate the game is lost until the page is refreshed. Furthermore, player names can consist solely of empty spaces.
When executing certain actions that are unlikely to occur in real-life gameplay, such as upgrading properties and mortgaging them simultaneously, errors may arise.

What could be improved:

Difficult to read

Absence of a file structure

Lack of Model-View-Controller architecture

No pure functions

Numerous side effects

Inconsistent naming conventions for functions and variables

Excessive re-renders
