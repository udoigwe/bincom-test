$(function () {

    'use strict';

	$(document).ready(function($) {

        //load parties
        loadParties();
        //load states
        loadStates();
        //onChangeState
        onChangeState();
        //onchange lga
        onChangeLGA();
        //onchange ward
        onChangeWard();
        //load polling unit results
        loadPollingUnitResults();
        //load lga total polling units scores
        loadLGATotalPollingUnitResults();
        //submit scores
        submitScoreSheet();
        

    });

    function loadStates()
    {
        blockUI();

        $.ajax({
            type: 'GET',
            url: `${API_URL_ROOT}/states`,
            dataType: 'json',
            success: function(response)
            {
                if(response.error == false)
                {
                    const states = response.states;
                    let html = ``;

                    for(let i = 0; i < states.length; i++)
                    {
                        const state = states[i];
                        html += `<option value="${state.state_id}">${state.state_name}</option>`;
                    }

                    $('.state').append(html);

                    unblockUI();
                }
                else
                {
                    unblockUI();
                    alert(response.message)
                }
            },
            error: function(req, status, err)
            {
                unblockUI();
                alert(`${req.responseText}`)
            }
        });
    }

    function loadParties()
    {
        blockUI();

        $.ajax({
            type: 'GET',
            url: `${API_URL_ROOT}/parties`,
            dataType: 'json',
            success: function(response)
            {
                if(response.error == false)
                {
                    const parties = response.parties;
                    let html = ``;

                    for(let i = 0; i < parties.length; i++)
                    {
                        const party = parties[i];
                        html += `<option value="${party.partyid}">${party.partyname}</option>`;
                    }

                    $('.party').append(html);

                    unblockUI();
                }
                else
                {
                    unblockUI();
                    alert(response.message)
                }
            },
            error: function(req, status, err)
            {
                unblockUI();
                alert(`${req.responseText}`)
            }
        });
    }

    function onChangeState()
    {
        $('.polling-unit-results .state').on('change', function(){
            const stateID = $(this).find('option:selected').val();

            blockUI();
            
            if(!stateID)
            {
                $('.polling-unit-results .lga').html(`<option value="">Please Select LGA</option>`);
                $('.polling-unit-results .ward').html(`<option value="">Please Select Ward</option>`);
                $('.polling-unit-results .polling-unit').html(`<option value="">Please Select Polling Unit</option>`);

                unblockUI();

                return false;
            }

            $.ajax({
                type: 'GET',
                url: `${API_URL_ROOT}/lgas?state_id=${stateID}`,
                dataType: 'json',
                success: function(response)
                {
                    if(response.error == false)
                    {
                        const lgas = response.lgas;
                        let html = `<option value="">Please Select LGA</option>`;

                        for(let i = 0; i < lgas.length; i++)
                        {
                            const lga = lgas[i];
                            html += `<option value="${lga.lga_id}">${lga.lga_name}</option>`;
                        }

                        $('.lga').html(html);

                        unblockUI();
                    }
                    else
                    {
                        alert(response.message);
                        unblockUI();
                    }
                },
                error: function(req, status, err)
                {
                    alert(`${req.responseText}`)
                    unblockUI();
                }
            });
        })
    }

    function onChangeLGA()
    {
        $('.polling-unit-results .lga').on('change', function(){
            const lgaID = $(this).find('option:selected').val();

            blockUI();
            
            if(!lgaID)
            {
                $('.polling-unit-results .ward').html(`<option value="">Please Select Ward</option>`);
                $('.polling-unit-results .polling-unit').html(`<option value="">Please Select Polling Unit</option>`);

                unblockUI();

                return false;
            }

            $.ajax({
                type: 'GET',
                url: `${API_URL_ROOT}/wards?lga_id=${lgaID}`,
                dataType: 'json',
                success: function(response)
                {
                    if(response.error == false)
                    {
                        const wards = response.wards;
                        let html = `<option value="">Please Select Ward</option>`;

                        for(let i = 0; i < wards.length; i++)
                        {
                            const ward = wards[i];
                            html += `<option value="${ward.ward_id}">${ward.ward_name}</option>`;
                        }

                        $('.ward').html(html);

                        unblockUI();
                    }
                    else
                    {
                        alert(response.message);
                        unblockUI();
                    }
                },
                error: function(req, status, err)
                {
                    alert(`${req.responseText}`)
                    unblockUI();
                }
            });
        })
    }

    function onChangeWard()
    {
        $('.polling-unit-results .ward').on('change', function(){
            const wardID = $(this).find('option:selected').val();

            blockUI();
            
            if(!wardID)
            {
                $('.polling-unit-results .polling-unit').html(`<option value="">Please Select Polling Unit</option>`);

                unblockUI();

                return false;
            }

            $.ajax({
                type: 'GET',
                url: `${API_URL_ROOT}/polling-units?ward_id=${wardID}`,
                dataType: 'json',
                success: function(response)
                {
                    if(response.error == false)
                    {
                        const pollingUnits = response.polling_units;
                        let html = `<option value="">Please Select Polling Unit</option>`;

                        for(let i = 0; i < pollingUnits.length; i++)
                        {
                            const pollingUnit = pollingUnits[i];
                            html += `<option value="${pollingUnit.uniqueid}">${pollingUnit.polling_unit_name}</option>`;
                        }

                        $('.polling-unit').html(html);

                        unblockUI();
                    }
                    else
                    {
                        alert(response.message);
                        unblockUI();
                    }
                },
                error: function(req, status, err)
                {
                    alert(`${req.responseText}`)
                    unblockUI();
                }
            });
        })
    }

    function loadPollingUnitResults()
    {
        $('#polling-unit-results').on('submit', function(e){
            e.preventDefault();
            var form = $(this);
            var state = form.find(".state").val();
            var LGA = form.find(".lga").val();
            var ward = form.find(".ward").val();
            var pollingUnit = form.find(".polling-unit").val();
            var pollingUnitName = form.find(".polling-unit option:selected").text();
            var fields = form.find('input.required, select.required, textarea.required');
            
            blockUI();

            for(var i=0; i < fields.length; i++)
            {
                if(fields[i].value == "")
                {
                    /*alert(fields[i].id)*/
                    unblockUI();
                    alert(`${fields[i].name} is required`)
                    return false;
                }
            }

            $.ajax({
                type: 'GET',
                url: `${API_URL_ROOT}/polling-unit-results?polling_unit_id=${pollingUnit}`,
                dataType: 'json',
                success: function(response)
                {
                    if(response.error == false)
                    {
                        const results = response.polling_unit_results
                        let serial = 1;
                        let html = ``;

                        $('.pu').text("");
                        $('.action-box-results').slideUp('slow');

                        for(let i = 0; i < results.length; i++)
                        {
                            const result = results[i];

                            html += `
                                <tr>
                                    <td>${serial}</td>
                                    <td>${result.party_abbreviation}</td>
                                    <td>${result.party_score}</td>
                                    <td>${result.entered_by_user}</td>
                                    <td>${result.date_entered}</td>
                                </tr>
                            `

                            serial++;
                        }

                        $('.pu-results tbody').html(html);
                        $('.pu').text(pollingUnitName);
                        $('.action-box-results').slideDown('slow');
                        unblockUI();
                    }
                    else
                    {
                        alert(response.message)
                        unblockUI();
                    }
                },
                error: function(req, status, err)
                {
                    alert(`${req.responseText}`)
                    unblockUI();
                }
            });
        });
    }

    function loadLGATotalPollingUnitResults()
    {
        $('#lga-results').on('submit', function(e){
            e.preventDefault();
            var form = $(this);
            var state = form.find(".state").val();
            var LGA = form.find(".lga").val();
            var LGAName = form.find(".lga option:selected").text();
            var fields = form.find('input.required, select.required, textarea.required');
            
            blockUI();

            for(var i=0; i < fields.length; i++)
            {
                if(fields[i].value == "")
                {
                    /*alert(fields[i].id)*/
                    unblockUI();
                    alert(`${fields[i].name} is required`)
                    return false;
                }
            }

            $.ajax({
                type: 'GET',
                url: `${API_URL_ROOT}/total-lga-polling-unit-results?lga_id=${LGA}`,
                dataType: 'json',
                success: function(response)
                {
                    if(response.error == false)
                    {
                        const results = response.total
                        let serial = 1;
                        let html = `
                            <tr>
                                <td>${serial}</td>
                                <td>${response.total}</td>
                            </tr>
                        `;

                        $('.lg').text("");
                        $('.action-box-results').slideUp('slow');

                        /* for(let i = 0; i < results.length; i++)
                        {
                            const result = results[i];

                            html += `
                                <tr>
                                    <td>${serial}</td>
                                    <td>${result.total_score}</td>
                                </tr>
                            `

                            serial++;
                        } */

                        $('.lga-results tbody').html(html);
                        $('.lg').text(LGAName);
                        $('.action-box-results').slideDown('slow');
                        unblockUI();
                    }
                    else
                    {
                        alert(response.message)
                        unblockUI();
                    }
                },
                error: function(req, status, err)
                {
                    alert(`${req.responseText}`)
                    unblockUI();
                }
            });
        });
    }

    function submitScoreSheet()
    {
        $('#score-sheet').on('submit', function(e){
            e.preventDefault();
            var form = $(this);
            var state = form.find(".state").val();
            var LGA = form.find(".lga").val();
            var ward = form.find(".ward").val();
            var pollingUnit = form.find(".polling-unit").val();
            var party = form.find(".party").val();
            var score = form.find(".score").val();
            var entered_by = form.find(".entered_by").val();
            var fields = form.find('input.required, select.required, textarea.required');
            
            blockUI();

            for(var i=0; i < fields.length; i++)
            {
                if(fields[i].value == "")
                {
                    /*alert(fields[i].id)*/
                    unblockUI();
                    alert(`${fields[i].name} is required`)
                    return false;
                }
            }

            $.ajax({
                type: 'POST',
                url: `${API_URL_ROOT}/submit`,
                data: JSON.stringify(form.serializeObject()),
                dataType: 'json',
                contentType: 'application/json',
                success: function(response)
                {
                    if(response.error == false)
                    {
                        alert(response.message);
                        form.get(0).reset();
                        unblockUI();
                    }
                    else
                    {
                        alert(response.message)
                        unblockUI();
                    }
                },
                error: function(req, status, err)
                {
                    alert(`${req.responseText}`)
                    unblockUI();
                }
            });
        });
    }
}); 