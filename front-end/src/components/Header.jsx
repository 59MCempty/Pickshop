
import { Badge, Navbar, Nav, Container, NavDropdown } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { FaShoppingCart, FaUser } from 'react-icons/fa'
import { LinkContainer } from 'react-router-bootstrap'

import { userLogout } from '../redux/slice/authSliceReducer.js'
import { useLogoutMutation } from '../redux/slice/userApiSlice.js'
import logo from '../assets/logo.png'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import SearchBox from './SearchBox.jsx'


const Header = () => {
    const { cartItems } = useSelector(state => state.cart)
    const { userInfo } = useSelector(state => state.auth)

    const [logoutApiCall] = useLogoutMutation()

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const logoutHandle = async () => {
        try {
            await logoutApiCall().unwrap()
            dispatch(userLogout())
            navigate('/login')

        } catch (err) {
            toast.error(err?.data?.message || err.error)
        }
    }

    return (
        <header>
            <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
                <Container>
                    <LinkContainer to="/">
                        <Navbar.Brand href="/">
                            <img src={logo} alt="logo_Proshop" />
                            Pickshop
                        </Navbar.Brand>
                    </LinkContainer>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto">
                            <SearchBox />
                            <LinkContainer to="/cart">
                                <Nav.Link><FaShoppingCart /> Cart
                                    {
                                        cartItems.length > 0 && (
                                            <Badge pill style={{ marginLeft: '5px' }} bg="success">
                                                {cartItems.reduce((a, c) => a + c.qty, 0)}
                                            </Badge>
                                        )
                                    }
                                </Nav.Link>

                            </LinkContainer>
                            {userInfo ? (
                                <NavDropdown title={userInfo.name} id="username">
                                    <LinkContainer to="/profile">
                                        <NavDropdown.Item>Profile</NavDropdown.Item>
                                    </LinkContainer>
                                    <NavDropdown.Item onClick={logoutHandle}>Log out</NavDropdown.Item>

                                </NavDropdown>
                            ) : (
                                <LinkContainer to="/login">
                                    <Nav.Link><FaUser /> Sign in</Nav.Link>
                                </LinkContainer>
                            )}

                            {userInfo && userInfo.isAdmin &&
                                <NavDropdown title="Admin" id="admin menu">
                                    <LinkContainer to="/admin/productlist">
                                        <NavDropdown.Item>
                                            Products
                                        </NavDropdown.Item>
                                    </LinkContainer>

                                    <LinkContainer to="/admin/orderlist">
                                        <NavDropdown.Item>
                                            Orders
                                        </NavDropdown.Item>
                                    </LinkContainer>

                                    <LinkContainer to="/admin/userlist">
                                        <NavDropdown.Item>
                                            Users
                                        </NavDropdown.Item>
                                    </LinkContainer>
                                </NavDropdown>}

                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    )
}

export default Header
