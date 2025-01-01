import React from 'react'
import { Button, Divider, TextField } from '@mui/material'
import AccountSidebar from '../../components/AccountSidebar'

const MyAccount = () => {
    return (
        <section className="py-10 w-full">
            <div className="container flex gap-5">
                <AccountSidebar />
                <div className="col-2 w-[50%]">
                    <div className="card bg-white p-5 shadow-md rounded-md">
                        <h2 className="pb-3">My Profile</h2>
                        <Divider />
                        <form action="" className="mt-5">
                            <div className="flex items-center gap-5">
                                <div className="w-[50%]">
                                    <TextField label="Full Name" variant="outlined" size="small" className="custom-textfield w-full" />
                                </div>
                                <div className="w-[50%]">
                                    <TextField label="Email" variant="outlined" size="small" className="custom-textfield w-full" />
                                </div>
                            </div>
                            <div className="flex items-center gap-5 mt-4">
                                <div className="w-[50%]">
                                    <TextField label="Mobile No." variant="outlined" size="small" className="custom-textfield w-full" />
                                </div>
                                <div className="flex gap-5 w-[50%]">
                                    <Button className="buttonPrimaryBlack w-full">Save</Button>
                                    <Button className="buttonPrimaryWhite w-full">Cancel</Button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default MyAccount
