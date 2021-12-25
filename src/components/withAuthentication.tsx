import React from "react";
import {useAuthState} from "react-firebase-hooks/auth";
import firebase from "../utils/firebaseClient";
import {AppLayout} from "./layouts/AppLayout";
import {PageSpinner} from "./shared/PageSpinner";
import {SignInForm} from "./forms/SignInForm";
import {NextPage} from "next";

export interface IPageProps {
    user: firebase.User;
}

export const withAuthentication = (Page: NextPage<IPageProps>) => {
    return () => {
        try {
            const [user, loading, error] = useAuthState(firebase.auth());

            return (
                <AppLayout>
                    {loading && !user && <PageSpinner/>}
                    {!loading && !user && !error && <SignInForm/>}
                    {!loading && user && !error && <Page user={user}/>}
                </AppLayout>
            )
        } catch {
            return <div><p>something went wrong</p></div>
        }
    };
}