import React from "react";
import {useAuthState} from "react-firebase-hooks/auth";
import firebase from "../utils/firebaseClient";
import {AppLayout} from "../components/layouts/AppLayout";
import {PageSpinner} from "../components/shared/PageSpinner";
import {SignInForm} from "../components/forms/SignInForm";
import {NextPage} from "next";

interface IProps {
    user: firebase.User;
}

export const withAuthentication = (Page: NextPage<IProps>) => {
    return () => {
        const [user, loading, error] = useAuthState(firebase.auth());

        return (
            <AppLayout>
                {loading && !user && <PageSpinner/>}
                {!loading && !user && !error && <SignInForm/>}
                {!loading && user && !error && <Page user={user}/>}
            </AppLayout>
        )
    };
}