import * as assert from 'assert';
import * as httpMocks from 'node-mocks-http';
import { addGuest, resetForTesting, getGuest, listGuesets } from './routes';


describe('routes', function() {

  // TODO: remove the tests for the dummy route
  it('addGuest', function () {
      // 1. Missing name
      const req1 = httpMocks.createRequest(
          {method: 'POST', url: '/api/add', body: {}});
      const res1 = httpMocks.createResponse();
      addGuest(req1, res1);
      assert.strictEqual(res1._getStatusCode(), 400);
      assert.deepStrictEqual(res1._getData(),
          "missing 'name' parameter");

      // 2. Missing host name
      const req2 = httpMocks.createRequest(
        {method: 'POST', url: '/api/add', body: {name: "k"}});
      const res2 = httpMocks.createResponse();
      addGuest(req2, res2);
      assert.strictEqual(res2._getStatusCode(), 400);
      assert.deepStrictEqual(res2._getData(),
        "missing host name");

      // 3. Missing if they are bringing a plus one
      const req3 = httpMocks.createRequest(
      {method: 'POST', url: '/api/add',
       body: {name: "k", guest_of: "Molly"}});
      const res3 = httpMocks.createResponse();
      addGuest(req3, res3);
      assert.strictEqual(res3._getStatusCode(), 400);
      assert.deepStrictEqual(res3._getData(),
      "not a true or false for if youre bringing someone");

        // 4. Missing if they are family of someone
      const req4 = httpMocks.createRequest(
      {method: 'POST', url: '/api/add',
       body: {name: "k", guest_of: "Molly", plus_one: true}});
      const res4 = httpMocks.createResponse();
      addGuest(req4, res4);
      assert.strictEqual(res4._getStatusCode(), 400);
      assert.deepStrictEqual(res4._getData(),
      "not a true or false or if you're family");

      // Missing how many people they are bringing
      const req5 = httpMocks.createRequest(
        {method: 'POST', url: '/api/add',
         body: {name: "k", guest_of: "Molly", plus_one: true, family: true}});
      const res5 = httpMocks.createResponse();
      addGuest(req5, res5);
      assert.strictEqual(res5._getStatusCode(), 400);
      assert.deepStrictEqual(res5._getData(),
        "number of people you're bringing isn't a valid number");

      // Missing dietary restrictions
      const req6 = httpMocks.createRequest(
          {method: 'POST', url: '/api/add',
           body: {name: "k", guest_of: "Molly", plus_one: true, family: true, tag_alongs: 1}});
      const res6 = httpMocks.createResponse();
      addGuest(req6, res6);
      assert.strictEqual(res6._getStatusCode(), 400);
      assert.deepStrictEqual(res6._getData(),
          "dietary restring is missing");

      
      const req7 = httpMocks.createRequest(
        {method: 'POST', url: '/api/add',
         body: {name: "k", guest_of: "Molly", plus_one: true, family: true, tag_alongs: 1, diet_restriction: "none"}});
      const res7 = httpMocks.createResponse();
      addGuest(req7, res7);
      assert.strictEqual(res7._getStatusCode(), 400);
      assert.deepStrictEqual(res7._getData(),
        "additional guest name is missing");
    
      const req8 = httpMocks.createRequest(
        {method: 'POST', url: '/api/add',
         body: {name: "k", guest_of: "Molly", plus_one: true, family: true, tag_alongs: 1, diet_restriction: "none", guest_name: "a"}});
      const res8 = httpMocks.createResponse();
      addGuest(req8, res8);
      assert.strictEqual(res8._getStatusCode(), 400);
      assert.deepStrictEqual(res8._getData(),
        "missing additional guests dietary restrictions");

        const req10 = httpMocks.createRequest(
          {method: 'POST', url: '/api/add',
           body: {name: "k", guest_of: "Molly", plus_one: true, family: true, tag_alongs: 1, diet_restriction: "none", guest_name: "a", guest_restrictions: "none"}});
        const res10 = httpMocks.createResponse();
        addGuest(req10, res10);
        assert.strictEqual(res10._getStatusCode(), 200);
        assert.deepStrictEqual(res10._getData().guest.name, "k");
        assert.deepStrictEqual(res10._getData().guest.guest_of, "Molly");
        assert.deepStrictEqual(res10._getData().guest.plus_one, true);
        assert.deepStrictEqual(res10._getData().guest.family, true);
        assert.deepStrictEqual(res10._getData().guest.tag_alongs, 1);
        assert.deepStrictEqual(res10._getData().guest.diet_restriction, "none");
        assert.deepStrictEqual(res10._getData().guest.guest_name, "a");
        assert.deepStrictEqual(res10._getData().guest.guest_restrictions, "none");

        const req11 = httpMocks.createRequest(
          {method: 'POST', url: '/api/add',
           body: {name: "a", guest_of: "James", plus_one: false, family: false, tag_alongs: 0, diet_restriction: "apple", guest_name: "k", guest_restrictions: "carrot"}});
        const res11 = httpMocks.createResponse();
        addGuest(req11, res11);
        assert.strictEqual(res10._getStatusCode(), 200);
        assert.deepStrictEqual(res11._getData().guest.name, "a");
        assert.deepStrictEqual(res11._getData().guest.guest_of, "James");
        assert.deepStrictEqual(res11._getData().guest.plus_one, false);
        assert.deepStrictEqual(res11._getData().guest.family, false);
        assert.deepStrictEqual(res11._getData().guest.tag_alongs, 0);
        assert.deepStrictEqual(res11._getData().guest.diet_restriction, "apple");
        assert.deepStrictEqual(res11._getData().guest.guest_name, "k");
        assert.deepStrictEqual(res11._getData().guest.guest_restrictions, "carrot");
        resetForTesting();
  });



  it('get', function() {
    resetForTesting();

    const req1 = httpMocks.createRequest(
        {method: 'POST', url: '/api/add',
         body: {name: "k", guest_of: "Molly", plus_one: true, family: true, tag_alongs: 1, diet_restriction: "none", guest_name: "a", guest_restrictions: "none"}});
    const res1 = httpMocks.createResponse();
    addGuest(req1, res1);
    assert.strictEqual(res1._getStatusCode(), 200);
    assert.deepStrictEqual(res1._getData().guest.name, "k");
    assert.deepStrictEqual(res1._getData().guest.guest_of, "Molly");
    assert.deepStrictEqual(res1._getData().guest.plus_one, true);
    assert.deepStrictEqual(res1._getData().guest.family, true);
    assert.deepStrictEqual(res1._getData().guest.tag_alongs, 1);
    assert.deepStrictEqual(res1._getData().guest.diet_restriction, "none");
    assert.deepStrictEqual(res1._getData().guest.guest_name, "a");
    assert.deepStrictEqual(res1._getData().guest.guest_restrictions, "none");

    const req2 = httpMocks.createRequest(
        {method: 'POST', url: '/api/add',
         body: {name: "a", guest_of: "James", plus_one: false, family: false, tag_alongs: 0, diet_restriction: "apple", guest_name: "k", guest_restrictions: "carrot"}});
    const res2 = httpMocks.createResponse();
    addGuest(req2, res2);
    assert.strictEqual(res2._getStatusCode(), 200);
    assert.deepStrictEqual(res2._getData().guest.name, "a");
    assert.deepStrictEqual(res2._getData().guest.guest_of, "James");
    assert.deepStrictEqual(res2._getData().guest.plus_one, false);
    assert.deepStrictEqual(res2._getData().guest.family, false);
    assert.deepStrictEqual(res2._getData().guest.tag_alongs, 0);
    assert.deepStrictEqual(res2._getData().guest.diet_restriction, "apple");
    assert.deepStrictEqual(res2._getData().guest.guest_name, "k");
    assert.deepStrictEqual(res2._getData().guest.guest_restrictions, "carrot");    

    // Separate domain for each branch:
    // 1. Missing name
    const req3 = httpMocks.createRequest(
        {method: 'GET', url: '/api/get', query: {}});
    const res3 = httpMocks.createResponse();
    getGuest(req3, res3);
    assert.strictEqual(res3._getStatusCode(), 400);
    assert.deepStrictEqual(res3._getData(), "missing 'name' parameter");

    // 2. Invalid name
    const req4 = httpMocks.createRequest(
        {method: 'GET', url: '/api/get', query: {name: "fridge"}});
    const res4 = httpMocks.createResponse();
    getGuest(req4, res4);
    assert.strictEqual(res4._getStatusCode(), 400);
    assert.deepStrictEqual(res4._getData(), "no guest with name 'fridge'");

    const req5 = httpMocks.createRequest(
        {method: 'GET', url: '/api/get', query: {name: "stool"}});
    const res5 = httpMocks.createResponse();
    getGuest(req5, res5);
    assert.strictEqual(res5._getStatusCode(), 400);
    assert.deepStrictEqual(res5._getData(), "no guest with name 'stool'");

    // 3. Auction found
    const req6 = httpMocks.createRequest(
        {method: 'GET', url: '/api/get', query: {name: "k"}});
    const res6 = httpMocks.createResponse();
    getGuest(req6, res6);
    assert.strictEqual(res6._getStatusCode(), 200);
    assert.deepStrictEqual(res6._getData().guest.name, "k");
    assert.deepStrictEqual(res6._getData().guest.guest_of, "Molly");

    const req7 = httpMocks.createRequest(
        {method: 'GET', url: '/api/get', query: {name: "a"}});
    const res7 = httpMocks.createResponse();
    getGuest(req7, res7);
    assert.strictEqual(res7._getStatusCode(), 200);
    assert.deepStrictEqual(res7._getData().guest.name, "a");
    assert.deepStrictEqual(res7._getData().guest.guest_of, "James");

    resetForTesting();
  });


  it('list', function() {
    resetForTesting();

    const req0 = httpMocks.createRequest(
        {method: 'GET', url: '/api/list', query: {}});
    const res0 = httpMocks.createResponse();
    listGuesets(req0, res0);
    assert.strictEqual(res0._getStatusCode(), 200);
    assert.deepStrictEqual(res0._getData(), {guests: []});

    const req1 = httpMocks.createRequest(
      {method: 'POST', url: '/api/add',
       body: {name: "k", guest_of: "Molly", plus_one: true, family: true, tag_alongs: 1, diet_restriction: "none", guest_name: "a", guest_restrictions: "none"}});
  const res1 = httpMocks.createResponse();
  addGuest(req1, res1);
  assert.strictEqual(res1._getStatusCode(), 200);
  assert.deepStrictEqual(res1._getData().guest.name, "k");
  assert.deepStrictEqual(res1._getData().guest.guest_of, "Molly");
  assert.deepStrictEqual(res1._getData().guest.plus_one, true);
  assert.deepStrictEqual(res1._getData().guest.family, true);
  assert.deepStrictEqual(res1._getData().guest.tag_alongs, 1);
  assert.deepStrictEqual(res1._getData().guest.diet_restriction, "none");
  assert.deepStrictEqual(res1._getData().guest.guest_name, "a");
  assert.deepStrictEqual(res1._getData().guest.guest_restrictions, "none");


  const req5 = httpMocks.createRequest(
    {method: 'GET', url: '/api/list', query: {}});
  const res5 = httpMocks.createResponse();
  listGuesets(req5, res5);
  assert.strictEqual(res5._getStatusCode(), 200);
  assert.deepStrictEqual(res5._getData().guests.length, 1);
  assert.deepStrictEqual(res5._getData().guests[0].name, "k");

  const req2 = httpMocks.createRequest(
      {method: 'POST', url: '/api/add',
       body: {name: "a", guest_of: "James", plus_one: false, family: false, tag_alongs: 0, diet_restriction: "apple", guest_name: "k", guest_restrictions: "carrot"}});
  const res2 = httpMocks.createResponse();
  addGuest(req2, res2);
  assert.strictEqual(res2._getStatusCode(), 200);
  assert.deepStrictEqual(res2._getData().guest.name, "a");
  assert.deepStrictEqual(res2._getData().guest.guest_of, "James");
  assert.deepStrictEqual(res2._getData().guest.plus_one, false);
  assert.deepStrictEqual(res2._getData().guest.family, false);
  assert.deepStrictEqual(res2._getData().guest.tag_alongs, 0);
  assert.deepStrictEqual(res2._getData().guest.diet_restriction, "apple");
  assert.deepStrictEqual(res2._getData().guest.guest_name, "k");
  assert.deepStrictEqual(res2._getData().guest.guest_restrictions, "carrot");  


   const req6 = httpMocks.createRequest(
       {method: 'GET', url: '/api/list', query: {}});
   const res6 = httpMocks.createResponse();
   listGuesets(req6, res6);
   assert.strictEqual(res6._getStatusCode(), 200);
   assert.deepStrictEqual(res6._getData().guests.length, 2);
   assert.deepStrictEqual(res6._getData().guests[0].name, "k");
   assert.deepStrictEqual(res6._getData().guests[1].name, "a");
       
    resetForTesting();
  });

});
