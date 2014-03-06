describe("Testing if Application Exists", function(){
    beforeEach(function() {
        this.addMatchers({
            toBeBuilt: function() {
                return (this && this!==null);
            }
        });
    });
    it("Should be a Global Object Application", function(){
        expect(Application).toBeBuilt();
    });
});