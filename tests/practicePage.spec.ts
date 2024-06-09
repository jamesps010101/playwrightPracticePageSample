import {test, expect} from '@playwright/test'

test.beforeEach(async({page}) => {
  // open same page for each test
  await page.goto('https://www.letskodeit.com/practice')
})

test.afterAll(async({page}) => {
  await page.close()
})

// tests
test ('radio button example', async({page}) => {
  const bmwRadio = page.locator('#bmwradio')
  const hondaRadio = page.locator('#hondaradio')

  await bmwRadio.check()
  await expect(bmwRadio).toBeChecked()
  await expect(hondaRadio).not.toBeChecked()

  await hondaRadio.check()
  await expect(hondaRadio).toBeChecked()
  await expect(bmwRadio).not.toBeChecked()
})

test('checkbox example', async({page}) => {
  const toBeChecked = ['BMW', 'Honda']
  const checkboxLocator = page.locator('#checkbox-example-div')
  
  for(let cb of toBeChecked) {
   await checkboxLocator.getByText(cb).locator('input').check()
  }

  for(let cb of toBeChecked) {
    await expect(checkboxLocator.getByText(cb).locator('input')).toBeChecked()
  }
})

test('switch window example', async({page}) => {
  //using promises
  const [newWindow] = await Promise.all([
    page.waitForEvent('popup'),
    page.getByRole('button', {name: 'Open Window'}).click()
  ])

  await newWindow.getByPlaceholder('Search Course').fill('javascript')
  await newWindow.locator('.find-course').click()
  await newWindow.waitForTimeout(500)
  await expect(newWindow.locator('.zen-course-title h4')).toHaveText('JavaScript for beginners')

  newWindow.close()
})

test('switch tab example', async({page, context}) => {
  //using listener
  const newTab = context.waitForEvent('page')
  await page.locator('a', {hasText: 'Open Tab'}).click()
  const newTabPage = await newTab

  await newTabPage.getByPlaceholder('Search Course').fill('javascript')
  await newTabPage.locator('.find-course').click()
  await newTabPage.waitForTimeout(500)
  await expect(newTabPage.locator('.zen-course-title h4')).toHaveText('JavaScript for beginners')

  newTabPage.close()
})

test('dropdown example', async({page}) => {
  const dropDown = page.locator('#carselect')
  await dropDown.selectOption('Benz')
  let selectedOpt = await dropDown.inputValue()
  expect(selectedOpt).toEqual('benz')
})

test('multiselect example', async({page}) => {
  const multiSelect = page.locator('#multiple-select-example')
  await multiSelect.selectOption(['Apple', 'Peach'])
  await expect(multiSelect).toHaveValues(['apple','peach'])
})

test('autosuggest example', async({page}) => {
  await page.locator('#autosuggest').fill('java')
  await expect(page.locator('.ui-menu-item')).toHaveCount(3)
})

test('enabled disabled example', async({page}) => {
  const fieldToCheck = page.getByPlaceholder('Enabled/Disabled Field')
  await expect(fieldToCheck).toBeEnabled()
  
  await page.locator('#disabled-button').click()
  await expect(fieldToCheck).toBeDisabled()
})

test('element displayed example', async({page}) => {
  const fieldToCheck = page.locator('#displayed-text')
  await expect(fieldToCheck).toBeVisible()

  await page.locator('#hide-textbox').click()
  await expect(fieldToCheck).toBeHidden()
})

test('alert example', async({page}) => {
  await page.getByPlaceholder('Enter Your Name').fill('Bob')

  //listener
  page.on('dialog', (d) => {
    expect(d.message()).toContain('Hello Bob')
    d.accept()
  })
  await page.locator('#alertbtn').click()
})

test('mouse hover example', async({page}) => {
  await page.locator('#mousehover').hover()
  await expect(page.locator('.mouse-hover-content')).toBeVisible()
})

test('web table example', async({page}) => {
  const webTable = page.locator('#product')
  let row = webTable.locator('tr').nth(3)
  let courseTitle = row.locator('td').nth(1)
  let coursePrice = row.locator('td').nth(2)

  await expect(courseTitle).toHaveText('JavaScript Programming Language')
  await expect(coursePrice).toHaveText('25')
})

test('iframe example', async({page}) => {
  const iFrame = page.frameLocator('#courses-iframe')
  await iFrame.getByPlaceholder('Search Course').fill('javascript')
  await iFrame.locator('.find-course').click()
  await page.waitForTimeout(500)
  await expect(iFrame.locator('.zen-course-title h4')).toHaveText('JavaScript for beginners')
})