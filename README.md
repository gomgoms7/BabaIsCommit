
## BabaIsCommit
creating a feature that applies SVG animations to a profile using Babaisyou characters and GitHub Actions.
  
  
  
# [How to apply Baba Is Commit]
  
## Step 1 : Fork this Repository



## Step 2 : Generate a Token
### 1. Go to your GitHub Settings (Click your profile picture -> Settings).
### 2. Scroll down the left sidebar and click Developer settings -> Personal access tokens -> Tokens (classic).
### 3. Click Generate new token (classic). 
### 4. Check the boxes for the repo and workflow scopes.
### 5. Copy the token immediately. (You won't be able to see it again! and Do not share this!).



## Step 3 : Add the Token to Your Repository Secrets
### 1.Go to your forked BabaIsCommit repository.
### 2.Click on the Settings -> Secrets and variables -> Actions.
### 3.Click the  New repository secret button.
### 4.Enter the exact following details:
### 5.Name: GH_TOKEN 
### 6.Secret: Paste the token you copied in Step 2

## Step 4 : Run the GitHub Action
### 1.In your forked repository, go to the Actions tabs.
### 2.On the left sidebar, click Update Baba Is Commit.
### 3.Click the gray Run workflow dropdown on the right, then click the green Run workflow button.

## Step 5 : Add Baba to Your Profile README
### 1.Go to your special profile repository (YOUR_USERNAME/YOUR_USERNAME) and edit the README.md file.
### 2.Paste the following HTML code where you want the animation to appear.
### 3.Make sure to replace YOUR_USERNAME with your actual GitHub username!

```yaml
<div align="center">
  <img src="https://raw.githubusercontent.com/YOUR_USERNAME/BabaIsCommit/baba-output/baba-is-commit.svg" width="100%" alt="Baba Is Commit" />
</div>
```


## License
### This project is a non-commercial, open-source fan project.
### All code in the project may be freely modified and distributed, but it may not be used for commercial purposes.

## Special Thanks
### I would like to express my deepest gratitude to the original creator, Arvi Teikari (Hempuli), for kindly granting permission for this project.
### I am also sincerely thankful to my friend Mr. Im for drawing Baba.
