describe "Testing if Application Exists", ->
  it "Should be a Global Object Application", ->
    expect(Application).not.toBe `undefined`; 
