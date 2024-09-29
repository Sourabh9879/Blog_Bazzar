import React, { useState } from 'react'
import { useDeleteUserMutation, useGetUserQuery } from '../../../redux/features/auth/authApi'
import { MdModeEdit } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import UpdateUserModel from './UpdateUserModel'
import { useSelector } from 'react-redux' // Assuming you're using redux for auth

function ManageUser() {
  const [selectedUser, setSelectedUser] = useState(null)
  const [isModelOpen, setIsModelOpen] = useState(false)
  const { data, error, isLoading, refetch } = useGetUserQuery()
  const [deleteUser] = useDeleteUserMutation()
  const navigate = useNavigate()
  
  const loggedInUserId = useSelector((state) => state.auth.user._id); // Fetch logged-in user id from the auth state

  const handleDelete = async (id) => {
    if (id === loggedInUserId) {
      alert("You cannot delete yourself!");
      return;
    }

    try {
      const response = await deleteUser(id).unwrap();
      alert("User deleted successfully");
      refetch();
    } catch (error) {
      console.log("Failed to delete user", error);
    }
  }

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsModelOpen(true);
  }

  const handleCloseModel = () => {
    setIsModelOpen(false);
    setSelectedUser(null);
  }

  return (
    <>
      {isLoading && <div>Loading....</div>}
      {error && <div>Error loading users</div>}

      <section className="py-1 bg-blueGray-50">
        <div className="w-full  mb-12 xl:mb-0 px-4 mx-auto ">
          <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded ">
            <div className="rounded-t mb-0 px-4 py-3 border-0">
              <div className="flex flex-wrap items-center">
                <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                  <h3 className="font-semibold text-base text-blueGray-700">All Users</h3>
                </div>
                <div className="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
                  <button className="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button">See all</button>
                </div>
              </div>
            </div>

            <div className="block w-full overflow-x-auto">
              <table className="items-center bg-transparent w-full border-collapse ">
                <thead>
                  <tr>
                    <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                      No.
                    </th>
                    <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                      User Email
                    </th>
                    <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                      User Role
                    </th>
                    <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                      Edit or Manage
                    </th>
                    <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                      Delete
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {data?.length > 0 ? (
                    data.map((user, index) => (
                      <tr key={user._id}>
                        <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left text-blueGray-700 ">
                          {index + 1}
                        </th>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 ">
                          {user?.email}
                        </td>
                        <td className="border-t-0 px-6 align-center border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                          <span className={`rounded-full py-[2px] px-3 ${user.role === 'admin' ? 'bg-indigo-500 text-white' : 'bg-amber-300'}`}>
                            {user?.role}
                          </span>
                        </td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                          <button
                            onClick={() => handleEdit(user)}
                            disabled={user._id === loggedInUserId} // Disable the edit button for the logged-in admin
                            className={`flex gap-1 items-center justify-center ${user._id === loggedInUserId ? 'opacity-50 cursor-not-allowed' : ''}`}>
                            <MdModeEdit /> Edit
                          </button>
                        </td>
                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                          <button
                            onClick={() => handleDelete(user._id)}
                            disabled={user._id === loggedInUserId} // Disable delete button if it's the logged-in admin
                            className={`bg-red-600 text-white px-2 py-1 ${user._id === loggedInUserId ? 'opacity-50 cursor-not-allowed' : ''}`}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center p-4">No Users Found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {isModelOpen && <UpdateUserModel user={selectedUser} onClose={handleCloseModel} onRoleUpdate={refetch} />}
    </>
  )
}

export default ManageUser;
