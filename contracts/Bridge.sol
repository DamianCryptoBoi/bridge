//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.10;

import "./SignatureVerifier.sol";
import "./IERC20.sol";
import "./Ownable.sol";

contract Bridge is SignatureVerifier, Ownable {
    uint256 public requiredRelayerToApprove;
    uint256 public depositFee; // fixed number in native currency
    uint256 public transferFee; // % in swap token
    uint256 public transferFeeDenominator = 10000;

    mapping(address => uint256) private _userNonce;
    mapping(address => address) private _matchPair;

    mapping(address => bool) public relayer;

    mapping(address => bool) public whitelist; // no fees
    mapping(address => bool) public blacklist; // blocked

    mapping(address => mapping(uint256 => uint256)) public transferApprovals;

    event TokenMovedToBridge(
        address indexed from,
        address tokenAddress,
        uint256 amount,
        uint256 nonce,
        bytes signature
    );
    event TokenMovedToUser(
        address indexed to,
        address tokenAddress,
        uint256 amount,
        uint256 nonce,
        bytes signature
    );

    constructor(
        uint256 _requiredRelayerToApprove,
        address[] memory _relayers,
        address[] memory _whitelist,
        uint256 _depositFee,
        uint256 _transferFee
    ) {
        requiredRelayerToApprove = _requiredRelayerToApprove;
        depositFee = _depositFee;
        transferFee = _transferFee;
        _setRelayer(_relayers, true);
        _setWhitelist(_whitelist, true);
    }

    function setRelayer(address[] memory _relayers, bool _authorized)
        external
        onlyOwner
    {
        _setRelayer(_relayers, _authorized);
    }

    function _setRelayer(address[] memory _relayers, bool _authorized)
        internal
    {
        for (uint8 i = 0; i < _relayers.length; i++) {
            relayer[_relayers[i]] = _authorized;
        }
    }

    function setWhitelist(address[] memory _whitelist, bool _isTrue)
        external
        onlyOwner
    {
        _setWhitelist(_whitelist, _isTrue);
    }

    function _setWhitelist(address[] memory _whitelist, bool _isTrue) internal {
        for (uint8 i = 0; i < _whitelist.length; i++) {
            whitelist[_whitelist[i]] = _isTrue;
        }
    }

    function setBlacklist(address[] memory _blacklist, bool _isTrue)
        external
        onlyOwner
    {
        _setBlacklist(_blacklist, _isTrue);
    }

    function _setBlacklist(address[] memory _blacklist, bool _isTrue) internal {
        for (uint8 i = 0; i < _blacklist.length; i++) {
            blacklist[_blacklist[i]] = _isTrue;
        }
    }

    function _approveTransfer() internal {}

    function getUserNonce() public view returns (uint256) {
        return _userNonce[msg.sender];
    }

    function addMatchTokenPair(address _token, address _matchToken)
        public
        onlyOwner
    {
        _matchPair[_token] = _matchToken;
    }

    function getMatchToken(address _token) public view returns (address) {
        return _matchPair[_token];
    }

    function bridgeTransferExactToken(
        address _to,
        address _tokenAddress,
        uint256 _amount,
        uint256 _nonce,
        bytes calldata _signature
    ) external onlyOwner returns (bool) {
        require(_tokenAddress != address(0), "BRIDGE: invalid token address");
        require(_amount > 0, "BRIDGE: invalid amount");
        require(_signature.length == 65, "BRIDGE: invalid signature");
        require(_userNonce[_to] == _nonce, "BRIDGE: mismatch nonce");
        require(
            _verifySignature(_to, _tokenAddress, _amount, _nonce, _signature),
            "BRIDGE: mismatch signature"
        );
        address _matchTokenAddress = getMatchToken(_tokenAddress);
        require(
            _matchTokenAddress != address(0),
            "BRIDGE: non-existent token match"
        );
        _userNonce[_to]++;
        _moveTokenFromBridgeToUser(_to, _matchTokenAddress, _amount);
        emit TokenMovedToUser(
            _to,
            _matchTokenAddress,
            _amount,
            _nonce,
            _signature
        );
        return true;
    }

    function moveTokenThroughBridgeForExactToken(
        address _tokenAddress,
        uint256 _amount,
        uint256 _nonce,
        bytes calldata _signature
    ) external returns (bool) {
        require(_nonce == _userNonce[msg.sender], "BRIDGE: nonce mismatch");
        _userNonce[msg.sender]++;
        _moveTokenFromUserToBridge(msg.sender, _tokenAddress, _amount);
        emit TokenMovedToBridge(
            msg.sender,
            _tokenAddress,
            _amount,
            _nonce,
            _signature
        );
        return true;
    }

    function _moveTokenFromUserToBridge(
        address _from,
        address _tokenAddress,
        uint256 _amount
    ) internal returns (bool) {
        require(_tokenAddress != address(0), "BRIDGE: invalid token address");
        require(_amount > 0, "BRIDGE: invalid amount");
        IERC20 token = IERC20(_tokenAddress);
        return token.transferFrom(_from, address(this), _amount); // transfer from user to bridge
    }

    function _moveTokenFromBridgeToUser(
        address _to,
        address _tokenAddress,
        uint256 _amount
    ) internal returns (bool) {
        require(_tokenAddress != address(0), "BRIDGE: invalid token address");
        require(_amount > 0, "BRIDGE: invalid amount");
        IERC20 token = IERC20(_tokenAddress);
        return token.transfer(address(_to), _amount); // transfer from bridge to user
    }
}
