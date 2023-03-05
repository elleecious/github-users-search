<script>
import axios from 'axios';
import {
        MaterialApp,
        Dialog,
        Row,
        Col,
        Card,
		CardTitle,
		CardSubtitle,
        CardActions,
        TextField,
        Button,
        ProgressCircular,
		Icon,
    } from "svelte-materialify";
import { onMount } from 'svelte';
import { dataparams } from './data/dataParams';
import { mdiTwitter } from '@mdi/js';

let time = new Date();
$: seconds = time.getSeconds();

onMount(() => {
	const interval = setInterval(() => {
		time = new Date();
	}, 1000);
	return () => {
		clearInterval();
	}
});

let header, msg, stat, code, response, msgBoxMessage;

let data = [];
let group;
let loading = false;

let shown = false;
let initialLoad = 1;

let frmData = {
	username: "",	
}

let diaMsgBox = false;
let myMsg = "";

let login_user, fullname, biography, avatar_url, twitter_username;

function MsgBoxClose() {
	diaMsgBox = false;
}

function alertBox(msg) {
	diaMsgBox = true;
	myMsg = msg;
}

async function searchUser(){
	loading = true;
	console.log("Username: " + frmData.username);

	let username = frmData.username;

	header = "" + axios.defaults.headers.common["Authorization"];
	let response = null;

	response = await axios.get("users/"+username,
		{},
		{
			AccessControlAllowOrigin: "*",
			headers: { Authorization:true },
			ContentType: "application/json"
		});

		console.log(response[0]);
		let myResponse = JSON.parse(JSON.stringify(response));
		console.log(myResponse);

		if (localStorage.isrefresh == 1) {
            localStorage.removeItem("isrefresh");
            searchUser();
        } else {
			console.log("STATUS: " + myResponse.status);

            let apiStatus = myResponse.status;

			if (apiStatus == 200) {
                console.log(myResponse.data[0]);
                data = myResponse.data[0];
                console.log(data);
                code = 200;
                shown = true;
                // loading = false;
                initialLoad = 0;
                loading = false;

				login_user = myResponse.data.login;
				avatar_url = myResponse.data.avatar_url;
				fullname = myResponse.data.name;
				biography = myResponse.data.bio;
				twitter_username = myResponse.data.twitter_username;
            }
            if (apiStatus == 404) {
                shown = false;
                loading = false;
                alertBox("No record found.");
            } else {
				console.log(myResponse.message);
			}
		}

}

</script>

<MaterialApp>
	<div class="container">
		<Row>
            <Col cols={12} xl={12} lg={12} md={12} sm={12}>
                <Card class="mx-auto">
                    <CardTitle
                        class="white-text justify-center text-uppercase"
                        style="background-color: #28297d;">Search</CardTitle
                    >
                    <Col cols={12} xl={12} lg={12} md={12} sm={12}>
                        <form>
                            <Row>
                                <Col cols={12} xl={10} lg={10} md={10} sm={10}>
                                    <TextField
                                        bind:value={frmData.username}
                                        style="border-color: #6200ee; color: #6200ee"
                                        outlined
                                        required
                                        >Search Username
                                    </TextField>
                                </Col>
                                <Button
                                    class="primary-color mt-5 mr-2"
                                    size="large"
                                    on:click={searchUser}>Search</Button
                                >
                                <Button
                                    type="reset"
                                    class="secondary-color mt-5 mr-2"
                                    size="large">Clear</Button
                                >
                            </Row>
                        </form>
                    </Col>
                </Card>
            </Col>
        </Row>

		<Row>
            <Col>
                {#if loading}
                    <ProgressCircular size={70} width={7} indeterminate color="success" />
               {/if}
                {#if shown}
                    {#if code === 200}
						<div class="d-flex justify-center mt-4 mb-4">
							<Card>
								<img class="card-img-top" src={avatar_url} alt="background" />
								<CardTitle>{ fullname }</CardTitle>
								<CardSubtitle>{ biography }</CardSubtitle>
								<div class="pa-2">
                                    <p>Username: { login_user }</p>
									<Icon class="primary-text" size="32px" path={mdiTwitter} />:<span>{ twitter_username }</span>
								</div>
							</Card>
						</div>
                    {/if}
                {/if}
            </Col>
        </Row>
	</div>
</MaterialApp>

<Dialog persistent bind:active={diaMsgBox}>
    <Card>
        <CardTitle class="white-text" style="background-color: #28297d;">
            {myMsg}
        </CardTitle>
        <CardActions>
            <Button class="primary-color ml-auto" on:click={MsgBoxClose}
                >Close</Button
            >
        </CardActions>
    </Card>
</Dialog>